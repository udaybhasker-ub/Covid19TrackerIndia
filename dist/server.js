/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/server/server-dev.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/server/server-dev.js":
/*!**********************************!*\
  !*** ./src/server/server-dev.js ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var webpack__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! webpack */ \"webpack\");\n/* harmony import */ var webpack__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(webpack__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var https__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! https */ \"https\");\n/* harmony import */ var https__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(https__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! webpack-dev-middleware */ \"webpack-dev-middleware\");\n/* harmony import */ var webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var webpack_hot_middleware__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! webpack-hot-middleware */ \"webpack-hot-middleware\");\n/* harmony import */ var webpack_hot_middleware__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(webpack_hot_middleware__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _webpack_dev_config_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../webpack.dev.config.js */ \"./webpack.dev.config.js\");\n/* harmony import */ var _webpack_dev_config_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_webpack_dev_config_js__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var node_cron__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! node-cron */ \"node-cron\");\n/* harmony import */ var node_cron__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(node_cron__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_8__);\n/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! aws-sdk */ \"aws-sdk\");\n/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(aws_sdk__WEBPACK_IMPORTED_MODULE_9__);\n\n\n\n\n\n\n\n\n\n\nvar app = express__WEBPACK_IMPORTED_MODULE_1___default()(),\n    DIST_DIR = __dirname,\n    HTML_FILE = path__WEBPACK_IMPORTED_MODULE_0___default.a.join(DIST_DIR, 'index.html'),\n    compiler = webpack__WEBPACK_IMPORTED_MODULE_2___default()(_webpack_dev_config_js__WEBPACK_IMPORTED_MODULE_6___default.a);\napp.use(webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_4___default()(compiler, {\n  publicPath: _webpack_dev_config_js__WEBPACK_IMPORTED_MODULE_6___default.a.output.publicPath\n}));\napp.use(webpack_hot_middleware__WEBPACK_IMPORTED_MODULE_5___default()(compiler));\napp.get('/covid', function (req, res, next) {\n  compiler.outputFileSystem.readFile(HTML_FILE, function (err, result) {\n    if (err) {\n      return next(err);\n    }\n\n    res.set('content-type', 'text/html');\n    res.send(result);\n    res.end();\n  });\n});\n\nvar request = function request(path, options, callback) {\n  app.get(path, function (req, resp, next) {\n    console.log(new Date() + ' - Request:' + req.url + ' from ' + req.connection.remoteAddress);\n    https__WEBPACK_IMPORTED_MODULE_3___default.a.get(options, function (res) {\n      var json = '';\n      res.on('data', function (chunk) {\n        json += chunk;\n      });\n      res.on('end', function () {\n        if (res.statusCode === 200) {\n          try {\n            callback(req, resp, json);\n          } catch (e) {\n            console.log('Error parsing JSON!', e);\n          }\n        } else {\n          console.log('Status:', res.statusCode);\n        }\n      });\n    }).on('error', function (err) {\n      console.log('Error:', err);\n    });\n  });\n};\n\nrequest('/latest/:stateName', {\n  host: 'api.rootnet.in',\n  path: '/covid19-in/stats/latest',\n  method: 'GET'\n}, function (req, resp, json) {\n  var stateName = req.params.stateName;\n  if (stateName == 'Telangana') stateName = 'Telengana';\n  var respData = JSON.parse(json),\n      data; //console.log(respData);\n\n  if (stateName == 'all') {\n    data = respData.data;\n  } else {\n    data = respData.data.regional.find(function (d) {\n      return d.loc === stateName;\n    });\n  }\n\n  resp.set('content-type', 'application/json');\n  resp.send(data);\n  resp.end();\n});\nrequest('/history/:stateName', {\n  host: 'api.rootnet.in',\n  path: '/covid19-in/stats/history',\n  method: 'GET'\n}, function (req, resp, json) {\n  var stateName = req.params.stateName;\n  if (stateName == 'Telangana') stateName = 'Telengana';\n  var respData = JSON.parse(json),\n      data; //console.log(stateName);\n  //console.log(respData);\n\n  if (stateName == 'all') {\n    data = respData.data;\n  } else {\n    var stateHistory = [];\n    respData.data.forEach(function (dayData) {\n      var data = dayData.regional.find(function (r) {\n        return r.loc === stateName;\n      });\n      if (data) stateHistory.push({\n        day: dayData.day,\n        data: data\n      });\n    });\n    data = stateHistory;\n  }\n\n  resp.set('content-type', 'application/json');\n  resp.send(data);\n  resp.end();\n});\nrequest('/history/states/all', {\n  host: 'api.covid19india.org',\n  path: '/states_daily.json',\n  method: 'GET'\n}, function (req, resp, json) {\n  var respData = JSON.parse(json); //console.log(respData);\n\n  resp.set('content-type', 'application/json');\n  resp.send(respData);\n  resp.end();\n});\nrequest('/latest/:stateName/districts', {\n  host: 'api.covid19india.org',\n  path: 'state_district_wise.json',\n  method: 'GET'\n}, function (req, resp, json) {\n  var stateName = req.params.stateName;\n  var respData = JSON.parse(json),\n      data; //console.log(respData);\n\n  if (stateName == 'all') {\n    data = respData;\n  } else {\n    data = respData[stateName];\n  }\n\n  resp.set('content-type', 'application/json');\n  resp.send(data);\n  resp.end();\n});\nrequest('/latest/:stateName/districtZones', {\n  host: 'api.covid19india.org',\n  path: 'zones.json',\n  method: 'GET'\n}, function (req, resp, json) {\n  var stateName = req.params.stateName;\n  var respData = JSON.parse(json),\n      data;\n\n  if (stateName == 'all') {\n    data = respData;\n  } else {\n    data = respData.zones.filter(function (d) {\n      return d.state === stateName;\n    });\n  }\n\n  resp.set('content-type', 'application/json');\n  resp.send(data);\n  resp.end();\n});\n\nvar getDoublingRate = function getDoublingRate(data, region) {\n  var result = {};\n  var lastSevenDaysData = data.filter(function (day) {\n    var timeDiff = new Date().getTime() - new Date(day.day).getTime();\n    return timeDiff <= 8 * 24 * 60 * 60 * 1000;\n  });\n  var doublingRate = 0;\n\n  try {\n    var totalPercentageIncrease = 0;\n\n    for (var i = lastSevenDaysData.length - 1; i > 0; i--) {\n      var increasePercentage = void 0;\n\n      if (region == 'India') {\n        increasePercentage = (lastSevenDaysData[i].summary.total - lastSevenDaysData[i - 1].summary.total) / lastSevenDaysData[i - 1].summary.total * 100;\n      } else {\n        var reg = lastSevenDaysData[i].regional.filter(function (r) {\n          return r.loc === region;\n        })[0],\n            regDayBefore = lastSevenDaysData[i - 1].regional.filter(function (r) {\n          return r.loc === region;\n        })[0];\n        increasePercentage = (reg.totalConfirmed - regDayBefore.totalConfirmed) / regDayBefore.totalConfirmed * 100;\n      }\n\n      totalPercentageIncrease += increasePercentage;\n    }\n\n    var avgPercetageIncrease = totalPercentageIncrease / (lastSevenDaysData.length - 1); //console.log(region + \":\" + avgPercetageIncrease);\n\n    doublingRate = avgPercetageIncrease > 0.0 ? 70 / avgPercetageIncrease : 0;\n  } catch (err) {\n    //console.error(err);\n    result.errorMessage = \"No sufficient data\";\n  }\n\n  result.region = region;\n  result.doublingRate = doublingRate; //console.log(result);\n\n  return result;\n};\n\nrequest('/latest/all/doublingrate', {\n  host: 'api.rootnet.in',\n  path: '/covid19-in/stats/history',\n  method: 'GET'\n}, function (req, resp, json) {\n  var data = JSON.parse(json),\n      result = {},\n      stateList = [];\n  if (!data.success) throw Error('Response failed!');\n  data = data.data;\n  data.forEach(function (day) {\n    var states = day.regional.map(function (r) {\n      return r.loc;\n    });\n    stateList.push({\n      states: states,\n      count: states.length\n    });\n  });\n  var maxCount = 0,\n      maxobj;\n  stateList.forEach(function (s) {\n    if (s.count > maxCount) maxobj = s;\n  });\n  stateList = maxobj.states;\n  stateList.push(\"India\");\n  stateList.forEach(function (r) {\n    result[r == 'Telengana' ? 'Telangana' : r] = getDoublingRate(data, r);\n  });\n  resp.set('content-type', 'application/json');\n  resp.send(result);\n  resp.end();\n});\naws_sdk__WEBPACK_IMPORTED_MODULE_9___default.a.config.update({\n  region: 'ap-south-1'\n});\nvar s3 = new aws_sdk__WEBPACK_IMPORTED_MODULE_9___default.a.S3({\n  apiVersion: '2006-03-01'\n});\naws_sdk__WEBPACK_IMPORTED_MODULE_9___default.a.config.getCredentials(function (err) {\n  if (err) console.log(err.stack); // credentials not loaded\n  else {\n      console.log(\"Access key:\", aws_sdk__WEBPACK_IMPORTED_MODULE_9___default.a.config.credentials.accessKeyId);\n      console.log(\"Secret access key:\", aws_sdk__WEBPACK_IMPORTED_MODULE_9___default.a.config.credentials.secretAccessKey);\n    }\n});\ns3.listBuckets(function (err, data) {\n  if (err) {\n    console.log(\"Error\", err);\n  } else {\n    console.log(\"Success\", data.Buckets);\n  }\n});\nnode_cron__WEBPACK_IMPORTED_MODULE_7___default.a.schedule(\"59 23 * * *\", function () {\n  console.log(\"---------------------\");\n  console.log(\"Saving latest distric data into a file\");\n  https__WEBPACK_IMPORTED_MODULE_3___default.a.get({\n    host: 'api.covid19india.org',\n    path: 'state_district_wise.json',\n    method: 'GET'\n  }, function (res) {\n    var json = '';\n    res.on('data', function (chunk) {\n      json += chunk;\n    });\n    res.on('end', function () {\n      if (res.statusCode === 200) {\n        try {\n          var uploadParams = {\n            Bucket: 'covid19india-data-daily',\n            Key: '',\n            Body: ''\n          };\n          var file = new Date().getTime() + '_latest_all_districts.json';\n          uploadParams.Body = json;\n          uploadParams.Key = path__WEBPACK_IMPORTED_MODULE_0___default.a.basename(file);\n          s3.upload(uploadParams, function (err, data) {\n            if (err) {\n              console.log(\"Error\", err);\n            }\n\n            if (data) {\n              console.log(\"Upload Success\", data.Location);\n            }\n          });\n        } catch (e) {\n          console.log('Error parsing JSON!', e);\n        }\n      } else {\n        console.log('Status:', res.statusCode);\n      }\n    });\n  }).on('error', function (err) {\n    console.log('Error:', err);\n  });\n});\nvar PORT = process.env.PORT || 8000;\napp.listen(PORT, function () {\n  console.log(\"App listening to \".concat(PORT, \"....\"));\n  console.log('Press Ctrl+C to quit.');\n});\n\n//# sourceURL=webpack:///./src/server/server-dev.js?");

/***/ }),

/***/ "./webpack.dev.config.js":
/*!*******************************!*\
  !*** ./webpack.dev.config.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var path = __webpack_require__(/*! path */ \"path\");\n\nvar webpack = __webpack_require__(/*! webpack */ \"webpack\");\n\nvar HtmlWebPackPlugin = __webpack_require__(/*! html-webpack-plugin */ \"html-webpack-plugin\");\n\nvar MiniCssExtractPlugin = __webpack_require__(/*! mini-css-extract-plugin */ \"mini-css-extract-plugin\");\n\nmodule.exports = {\n  entry: {\n    main: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', './src/index.js']\n  },\n  output: {\n    path: path.join(__dirname, 'dist'),\n    publicPath: '/',\n    filename: '[name].js'\n  },\n  mode: 'development',\n  target: 'web',\n  devtool: 'source-map',\n  module: {\n    rules: [{\n      enforce: \"pre\",\n      test: /\\.js$/,\n      exclude: /node_modules/,\n      loader: \"eslint-loader\",\n      options: {\n        emitWarning: true,\n        failOnError: false,\n        failOnWarning: false\n      }\n    }, {\n      test: /\\.js$/,\n      exclude: /node_modules/,\n      loader: \"babel-loader\"\n    }, {\n      test: /\\.jst$/,\n      loader: 'underscore-template-loader'\n    }, {\n      // Loads the javacript into html template provided.\n      // Entry point is set below in HtmlWebPackPlugin in Plugins \n      test: /\\.html$/,\n      use: [{\n        loader: \"html-loader\" //options: { minimize: true }\n\n      }]\n    }, {\n      test: /\\.css$/,\n      use: ['style-loader', 'css-loader']\n    }, {\n      test: /\\.less$/,\n      use: [{\n        loader: MiniCssExtractPlugin.loader\n      }, {\n        loader: 'css-loader'\n      }, {\n        loader: 'less-loader'\n      }]\n    }, {\n      test: /\\.(png|jpg|jpeg|gif)$/,\n      use: [{\n        loader: 'file-loader',\n        options: {\n          outputPath: \"images\",\n          esModule: false\n        }\n      }]\n    }, {\n      test: /jquery/,\n      use: [{\n        loader: 'expose-loader',\n        options: '$'\n      }, {\n        loader: 'expose-loader',\n        options: 'jQuery'\n      }]\n    }]\n  },\n  resolve: {\n    modules: [path.resolve(__dirname, 'src', 'js', 'components'), 'node_modules'],\n    extensions: ['.js']\n  },\n  plugins: [new HtmlWebPackPlugin({\n    template: \"./src/html/covid/index.html\",\n    filename: \"./covid/index.html\",\n    excludeChunks: ['server']\n  }), new webpack.ProvidePlugin({\n    _: 'underscore'\n  }), new MiniCssExtractPlugin({\n    filename: '[name].css'\n  }), new webpack.HotModuleReplacementPlugin(), new webpack.NoEmitOnErrorsPlugin()]\n};\n\n//# sourceURL=webpack:///./webpack.dev.config.js?");

/***/ }),

/***/ "aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"aws-sdk\");\n\n//# sourceURL=webpack:///external_%22aws-sdk%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");\n\n//# sourceURL=webpack:///external_%22fs%22?");

/***/ }),

/***/ "html-webpack-plugin":
/*!**************************************!*\
  !*** external "html-webpack-plugin" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"html-webpack-plugin\");\n\n//# sourceURL=webpack:///external_%22html-webpack-plugin%22?");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"https\");\n\n//# sourceURL=webpack:///external_%22https%22?");

/***/ }),

/***/ "mini-css-extract-plugin":
/*!******************************************!*\
  !*** external "mini-css-extract-plugin" ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mini-css-extract-plugin\");\n\n//# sourceURL=webpack:///external_%22mini-css-extract-plugin%22?");

/***/ }),

/***/ "node-cron":
/*!****************************!*\
  !*** external "node-cron" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"node-cron\");\n\n//# sourceURL=webpack:///external_%22node-cron%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "webpack":
/*!**************************!*\
  !*** external "webpack" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"webpack\");\n\n//# sourceURL=webpack:///external_%22webpack%22?");

/***/ }),

/***/ "webpack-dev-middleware":
/*!*****************************************!*\
  !*** external "webpack-dev-middleware" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"webpack-dev-middleware\");\n\n//# sourceURL=webpack:///external_%22webpack-dev-middleware%22?");

/***/ }),

/***/ "webpack-hot-middleware":
/*!*****************************************!*\
  !*** external "webpack-hot-middleware" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"webpack-hot-middleware\");\n\n//# sourceURL=webpack:///external_%22webpack-hot-middleware%22?");

/***/ })

/******/ });