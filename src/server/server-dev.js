import path from 'path'
import express from 'express'
import webpack from 'webpack'
import https from 'https'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from '../../webpack.dev.config.js'
import cron from 'node-cron'
import fs from 'fs'
import AWS from 'aws-sdk'


const app = express(),
    DIST_DIR = __dirname,
    HTML_FILE = path.join(DIST_DIR, 'index.html'),
    compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}))
app.use(webpackHotMiddleware(compiler))
app.get('/covid', (req, res, next) => {
    compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
        if (err) {
            return next(err)
        }
        res.set('content-type', 'text/html')
        res.send(result)
        res.end()
    })
});

const request = (path, options, callback) => {
    app.get(path, (req, resp, next) => {
        console.log(new Date() + ' - Request:' + req.url + ' from ' + req.connection.remoteAddress);
        https.get(options, (res) => {
            var json = '';

            res.on('data', function (chunk) {
                json += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        callback(req, resp, json);
                    } catch (e) {
                        console.log('Error parsing JSON!', e);
                    }
                } else {
                    console.log('Status:', res.statusCode);
                }
            });
        }).on('error', function (err) {
            console.log('Error:', err);
        });
    });
};

request('/latest/:stateName', {
    host: 'api.rootnet.in',
    path: '/covid19-in/stats/latest',
    method: 'GET'
}, (req, resp, json) => {
    let stateName = req.params.stateName;
    if (stateName == 'Telangana') stateName = 'Telengana';
    let respData = JSON.parse(json), data;
    //console.log(respData);
    if (stateName == 'all') {
        data = respData.data;
    } else {
        data = respData.data.regional.find(d => d.loc === stateName);
    }
    resp.set('content-type', 'application/json')
    resp.send(data);
    resp.end();
});

request('/history/:stateName', {
    host: 'api.rootnet.in',
    path: '/covid19-in/stats/history',
    method: 'GET'
}, (req, resp, json) => {
    let stateName = req.params.stateName;
    if (stateName == 'Telangana') stateName = 'Telengana';
    var respData = JSON.parse(json), data;

    //console.log(stateName);
    //console.log(respData);
    if (stateName == 'all') {
        data = respData.data;
    } else {
        let stateHistory = [];
        respData.data.forEach((dayData) => {
            let data = dayData.regional.find(r => r.loc === stateName);
            if (data) stateHistory.push({ day: dayData.day, data });
        });
        data = stateHistory;
    }

    resp.set('content-type', 'application/json');
    resp.send(data);
    resp.end()
});
request('/history/states/all', {
    host: 'api.covid19india.org',
    path: '/states_daily.json',
    method: 'GET'
}, (req, resp, json) => {
    var respData = JSON.parse(json);
    //console.log(respData);
    resp.set('content-type', 'application/json');
    resp.send(respData);
    resp.end()
});

request('/latest/:stateName/districts', {
    host: 'api.covid19india.org',
    path: 'state_district_wise.json',
    method: 'GET'
}, (req, resp, json) => {
    let stateName = req.params.stateName;
    var respData = JSON.parse(json), data;
    //console.log(respData);
    if (stateName == 'all') {
        data = respData;
    } else {
        data = respData[stateName];
    }
    resp.set('content-type', 'application/json')
    resp.send(data);
    resp.end()
});

request('/latest/:stateName/districtZones', {
    host: 'api.covid19india.org',
    path: 'zones.json',
    method: 'GET'
}, (req, resp, json) => {
    let stateName = req.params.stateName;
    let respData = JSON.parse(json), data;
    if (stateName == 'all') {
        data = respData;
    } else {
        data = respData.zones.filter(d => d.state === stateName);
    }
    resp.set('content-type', 'application/json')
    resp.send(data);
    resp.end();
});

let getDoublingRate = (data, region) => {
    let result = {};
    let lastSevenDaysData = data.filter((day) => {
        const timeDiff = new Date().getTime() - new Date(day.day).getTime();
        return timeDiff <= (8 * 24 * 60 * 60 * 1000);
    });
    let doublingRate = 0;
    try {
        let totalPercentageIncrease = 0;
        for (let i = lastSevenDaysData.length - 1; i > 0; i--) {
            let increasePercentage;
            if (region == 'India') {
                increasePercentage = ((lastSevenDaysData[i].summary.total - lastSevenDaysData[i - 1].summary.total) / lastSevenDaysData[i - 1].summary.total) * 100;
            } else {
                const reg = lastSevenDaysData[i].regional.filter(r => r.loc === region)[0],
                    regDayBefore = lastSevenDaysData[i - 1].regional.filter(r => r.loc === region)[0];
                increasePercentage = ((reg.totalConfirmed - regDayBefore.totalConfirmed) / regDayBefore.totalConfirmed) * 100;
            }
            totalPercentageIncrease += increasePercentage;
        }
        const avgPercetageIncrease = totalPercentageIncrease / (lastSevenDaysData.length - 1);
        //console.log(region + ":" + avgPercetageIncrease);
        doublingRate = (avgPercetageIncrease > 0.0) ? (70 / avgPercetageIncrease) : 0;
    } catch (err) {
        //console.error(err);
        result.errorMessage = "No sufficient data";
    }

    result.region = region;
    result.doublingRate = doublingRate;
    //console.log(result);
    return result;
};

request('/latest/all/doublingrate', {
    host: 'api.rootnet.in',
    path: '/covid19-in/stats/history',
    method: 'GET'
}, (req, resp, json) => {
    let data = JSON.parse(json), result = {}, stateList = [];
    if (!data.success) throw Error('Response failed!');
    data = data.data;
    data.forEach((day) => {
        const states = day.regional.map(r => r.loc);
        stateList.push({
            states,
            count: states.length
        });
    });
    let maxCount = 0, maxobj;
    stateList.forEach(s => { if (s.count > maxCount) maxobj = s });
    stateList = maxobj.states;
    stateList.push("India");
    stateList.forEach(r => {
        result[(r == 'Telengana' ? 'Telangana' : r)] = getDoublingRate(data, r);
    });

    resp.set('content-type', 'application/json');
    resp.send(result);
    resp.end();
});

/*
AWS.config.update({
    region: 'ap-south-1'
});
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

AWS.config.getCredentials(function (err) {
    if (err) console.log(err.stack);
    // credentials not loaded
    else {
        console.log("Access key:", AWS.config.credentials.accessKeyId);
        console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
    }
});
s3.listBuckets(function (err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data.Buckets);
    }
});

cron.schedule("59 23 * * *", function () {
    console.log("---------------------");
    console.log("Saving latest distric data into a file");
    https.get({
        host: 'api.covid19india.org',
        path: 'state_district_wise.json',
        method: 'GET'
    }, (res) => {
        var json = '';
        res.on('data', function (chunk) {
            json += chunk;
        });
        res.on('end', () => {
            if (res.statusCode === 200) {
                try {
                    var uploadParams = { Bucket: 'covid19india-data-daily', Key: '', Body: '' };
                    var file = new Date().getTime() + '_latest_all_districts.json';
                    uploadParams.Body = json;
                    uploadParams.Key = path.basename(file);

                    s3.upload(uploadParams, function (err, data) {
                        if (err) {
                            console.log("Error", err);
                        } if (data) {
                            console.log("Upload Success", data.Location);
                        }
                    });
                } catch (e) {
                    console.log('Error parsing JSON!', e);
                }
            } else {
                console.log('Status:', res.statusCode);
            }
        });
    }).on('error', function (err) {
        console.log('Error:', err);
    });
});*/

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})