import path from 'path'
import express from 'express'
import webpack from 'webpack'
import https from 'https'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from '../../webpack.dev.config.js'
import testLatest from './TESTDATA/latest.json'

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
        console.log(new Date() + ' - Request:' + req.url + ' from '+req.connection.remoteAddress);
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

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})