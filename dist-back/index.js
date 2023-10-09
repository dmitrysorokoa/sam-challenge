/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./distribution.ts":
/*!*************************!*\
  !*** ./distribution.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Distribution: () => (/* binding */ Distribution),\n/* harmony export */   getDistribution: () => (/* binding */ getDistribution),\n/* harmony export */   getLogNormalDistribution: () => (/* binding */ getLogNormalDistribution),\n/* harmony export */   getNormalDistributionNumber: () => (/* binding */ getNormalDistributionNumber)\n/* harmony export */ });\n/* harmony import */ var random__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! random */ \"random\");\n/* harmony import */ var random__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(random__WEBPACK_IMPORTED_MODULE_0__);\n\nconst getLinearDistribution = (count, a = 0, b = 300) => {\n    const etalonExpectedValue = (a + 2 * b) / 3;\n    const etalonVariance = Math.pow(b - a, 2) / 18;\n    const nums = [];\n    for (let i = 0; i < count; i++) {\n        const r = Math.max(Math.random(), Math.random());\n        nums.push(a + (b - a) * r);\n    }\n    return { nums, etalonExpectedValue, etalonVariance };\n};\nconst getNormalDistributionNumber = (min = 0, max = 300, skew = 1) => {\n    let u = 0, v = 0;\n    while (u === 0)\n        u = Math.random(); //Converting [0,1) to (0,1)\n    while (v === 0)\n        v = Math.random();\n    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);\n    num = num / 10.0 + 0.5; // Translate to 0 -> 1\n    if (num > 1 || num < 0)\n        num = getNormalDistributionNumber(min, max, skew);\n    else {\n        num = Math.pow(num, skew); // Skew\n        num *= max - min; // Stretch to fill range\n        num += min; // offset to min\n    }\n    return num;\n};\nfunction intFromInterval(value, min = 0, max = 300) {\n    return Math.floor(value * (max - min + 1) + min);\n}\nconst getNormalDistribution = (count) => {\n    const nums = [];\n    for (let i = 0; i < count; i++) {\n        nums.push(getNormalDistributionNumber());\n    }\n    return { nums, etalonExpectedValue: 0, etalonVariance: 0 };\n};\nconst getExponentialDistribution = (count) => {\n    const nums = [];\n    const lambda = 7;\n    const exp = random__WEBPACK_IMPORTED_MODULE_0___default().exponential(lambda);\n    for (let i = 0; i < count; i++) {\n        nums.push(intFromInterval(exp()));\n    }\n    return {\n        nums,\n        etalonExpectedValue: (1 / lambda) * 300,\n        etalonVariance: 1 / Math.pow(lambda / 300, 2),\n    };\n};\nconst getLogNormalDistribution = (count) => {\n    const nums = [];\n    const logNormal = random__WEBPACK_IMPORTED_MODULE_0___default().logNormal(0, 0.9);\n    for (let i = 0; i < count; i++) {\n        nums.push(intFromInterval(logNormal() / Math.PI));\n    }\n    return {\n        nums: nums.filter((el) => el < 300 && el > 0),\n        etalonExpectedValue: 0,\n        etalonVariance: 0,\n    };\n};\nvar Distribution;\n(function (Distribution) {\n    Distribution[Distribution[\"Normal\"] = 0] = \"Normal\";\n    Distribution[Distribution[\"Linear\"] = 1] = \"Linear\";\n    Distribution[Distribution[\"Exp\"] = 2] = \"Exp\";\n    Distribution[Distribution[\"Bernoulli\"] = 3] = \"Bernoulli\";\n})(Distribution || (Distribution = {}));\nconst distributionMap = {\n    [Distribution.Normal]: getNormalDistribution,\n    [Distribution.Linear]: getLinearDistribution,\n    [Distribution.Exp]: getExponentialDistribution,\n    [Distribution.Bernoulli]: getLogNormalDistribution,\n};\nconst getChartData = (nums) => {\n    const min = 0, max = 300, step = 10;\n    const count = Math.ceil((max - min) / step);\n    const data = new Array(count).fill(0);\n    nums.forEach((item) => {\n        const section = Math.floor(item / step);\n        if (section >= 0 && section < count)\n            ++data[section];\n    });\n    const labels = new Array(count).fill(0).map((el, index) => {\n        const first = Number((index * step).toFixed(2));\n        const second = Number((first + step).toFixed(2));\n        return `${first} - ${second}`;\n    });\n    return { count, data, labels };\n};\nconst getDistribution = (type, count = 100000) => {\n    const { nums, etalonExpectedValue, etalonVariance } = distributionMap[type](count);\n    const sum = nums.reduce((acc, el) => acc + el, 0);\n    const calculatedExpectedValue = sum / count;\n    const dSUM = nums.reduce((acc, el) => acc + Math.pow(el - calculatedExpectedValue, 2), 0);\n    const calculatedVariance = dSUM / count;\n    return {\n        etalonExpectedValue,\n        calculatedExpectedValue,\n        etalonVariance,\n        calculatedVariance,\n        nums,\n        chartData: getChartData(nums),\n    };\n};\n\n\n//# sourceURL=webpack://client/./distribution.ts?");

/***/ }),

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createRandomUser: () => (/* binding */ createRandomUser),\n/* harmony export */   users: () => (/* binding */ users)\n/* harmony export */ });\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _faker_js_faker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @faker-js/faker */ \"@faker-js/faker\");\n/* harmony import */ var _faker_js_faker__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_faker_js_faker__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! http */ \"http\");\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var socket_io__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! socket.io */ \"socket.io\");\n/* harmony import */ var socket_io__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(socket_io__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! cors */ \"cors\");\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var random__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! random */ \"random\");\n/* harmony import */ var random__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(random__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var _distribution__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./distribution */ \"./distribution.ts\");\n\n\n\n\n\n\n\n\nfunction createRandomUser() {\n    return {\n        userId: _faker_js_faker__WEBPACK_IMPORTED_MODULE_2__.faker.string.uuid(),\n        username: _faker_js_faker__WEBPACK_IMPORTED_MODULE_2__.faker.internet.userName(),\n        text: _faker_js_faker__WEBPACK_IMPORTED_MODULE_2__.faker.word.words({ count: { min: 2, max: 3 } }),\n    };\n}\nconst users = _faker_js_faker__WEBPACK_IMPORTED_MODULE_2__.faker.helpers.multiple(createRandomUser, {\n    count: 999,\n});\nconst initPros = [\n    'English language',\n    'High salaries',\n    'Change careers easily',\n    'Many visas to work',\n    'Good nature',\n    'Live close to the beach',\n    'Good healthcare system',\n    'Low crime rate',\n    'Infrastructure',\n    'Good air quality',\n];\nconst initCons = [\n    'Expensive country',\n    'Hard to find your first job',\n    'High taxes',\n    'The weather can be extreme',\n    'Scary wildlife and nature',\n    'The sun is dangerous',\n    'Some health services are costly',\n    'Public transport is expensive',\n    'Relationship with alcohol',\n    'Everything closes early',\n];\nconst initVoting = () => {\n    return {\n        pros: initPros.slice(),\n        cons: initCons.slice(),\n        createdPros: [],\n        createdCons: [],\n        voteCount: 0,\n        startDate: Date.now(),\n        time: '0:0',\n    };\n};\nlet votingData;\nvar EventType;\n(function (EventType) {\n    EventType[\"CreatePro\"] = \"CreatePro\";\n    EventType[\"CreateCon\"] = \"CreateCon\";\n    EventType[\"Like\"] = \"Like\";\n    EventType[\"Dislike\"] = \"Dislike\";\n})(EventType || (EventType = {}));\nconst app = express__WEBPACK_IMPORTED_MODULE_0___default()();\napp.use(cors__WEBPACK_IMPORTED_MODULE_5___default()());\nconst server = http__WEBPACK_IMPORTED_MODULE_3___default().createServer(app);\nconst io = new socket_io__WEBPACK_IMPORTED_MODULE_4__.Server(server, {\n    cors: {\n        origin: 'http://localhost:5173',\n    },\n});\nconst convertMillisecondsInTime = (value, withMiliseconds = true) => {\n    const min = Math.floor((value / 1000 / 60) << 0);\n    const sec = Math.floor((value / 1000) % 60);\n    const milliseconds = value % 1000;\n    return `${min}:${sec}${withMiliseconds ? `.${milliseconds}` : ''}`;\n};\nconst getAvailableEvents = () => {\n    const events = [];\n    if ((votingData?.createdPros.length || votingData?.createdCons.length) &&\n        votingData.voteCount < 10000) {\n        events.push(EventType.Dislike, EventType.Like);\n    }\n    if (votingData?.pros.length) {\n        events.push(EventType.CreatePro);\n    }\n    if (votingData?.cons.length) {\n        events.push(EventType.CreateCon);\n    }\n    return events;\n};\nconst getRandomCreatedElement = () => {\n    if (!votingData)\n        return;\n    const proAndCons = votingData.createdCons.concat(votingData.createdPros);\n    const randomIndex = Math.floor(Math.random() * proAndCons.length);\n    return proAndCons[randomIndex];\n};\nconst likeEvent = (selectedElement) => {\n    if (!votingData)\n        return;\n    const element = selectedElement || getRandomCreatedElement();\n    if (!element)\n        return;\n    element.likes = element.likes + 1;\n    votingData.voteCount++;\n    io.emit('chat message', {\n        id: _faker_js_faker__WEBPACK_IMPORTED_MODULE_2__.faker.string.uuid(),\n        message: `${convertMillisecondsInTime(Date.now() - votingData.startDate)} like: ${element.title}`,\n    });\n};\nconst dislikeEvent = (selectedElement) => {\n    if (!votingData)\n        return;\n    const element = selectedElement || getRandomCreatedElement();\n    if (!element)\n        return;\n    element.dislikes = element.dislikes + 1;\n    votingData.voteCount++;\n    io.emit('chat message', {\n        id: _faker_js_faker__WEBPACK_IMPORTED_MODULE_2__.faker.string.uuid(),\n        message: `${convertMillisecondsInTime(Date.now() - votingData.startDate)} dislike: ${element.title}`,\n    });\n};\nconst getRandomElement = (items) => {\n    if (!votingData)\n        return;\n    const randomIndex = Math.floor(Math.random() * items.length);\n    return items.splice(randomIndex, 1)[0];\n};\nconst createConEvent = (text) => {\n    if (!votingData)\n        return;\n    const selecteCon = text || getRandomElement(votingData.cons);\n    if (!selecteCon)\n        return;\n    votingData.createdCons.push({\n        id: _faker_js_faker__WEBPACK_IMPORTED_MODULE_2__.faker.string.uuid(),\n        title: selecteCon,\n        likes: 0,\n        dislikes: 0,\n    });\n    io.emit('chat message', {\n        id: _faker_js_faker__WEBPACK_IMPORTED_MODULE_2__.faker.string.uuid(),\n        message: `${convertMillisecondsInTime(Date.now() - votingData.startDate)} create con: ${selecteCon}`,\n    });\n};\nconst createProEvent = (text) => {\n    if (!votingData)\n        return;\n    const selectePro = text || getRandomElement(votingData.pros);\n    if (!selectePro)\n        return;\n    votingData.createdPros.push({\n        id: _faker_js_faker__WEBPACK_IMPORTED_MODULE_2__.faker.string.uuid(),\n        title: selectePro,\n        likes: 0,\n        dislikes: 0,\n    });\n    io.emit('chat message', {\n        id: _faker_js_faker__WEBPACK_IMPORTED_MODULE_2__.faker.string.uuid(),\n        message: `${convertMillisecondsInTime(Date.now() - votingData.startDate)} create pro: ${selectePro}`,\n    });\n};\nconst eventsMap = {\n    [EventType.CreateCon]: createConEvent,\n    [EventType.CreatePro]: createProEvent,\n    [EventType.Like]: likeEvent,\n    [EventType.Dislike]: dislikeEvent,\n};\nlet votingStatus = false;\nconst runRandomEvent = () => {\n    if (!votingData)\n        return;\n    const events = getAvailableEvents();\n    const randomIndex = Math.floor(Math.random() * events.length);\n    const event = events[randomIndex];\n    if (event) {\n        eventsMap[event]();\n    }\n    else {\n        console.log('dont have available events');\n        // io.emit('vote end');\n    }\n};\nlet eventGeneratorTimerId;\nconst config = (__webpack_require__(/*! platformsh-config */ \"platformsh-config\").config)();\nconst port = !config.isValidPlatform() ? 3003 : config.port;\napp.use(express__WEBPACK_IMPORTED_MODULE_0___default()[\"static\"](path__WEBPACK_IMPORTED_MODULE_1___default().join(__dirname, '..', 'dist-back')));\napp.use(express__WEBPACK_IMPORTED_MODULE_0___default()[\"static\"]('public'));\napp.get('/api/distributions', (req, res) => {\n    res.send({\n        normal: { ...(0,_distribution__WEBPACK_IMPORTED_MODULE_7__.getDistribution)(_distribution__WEBPACK_IMPORTED_MODULE_7__.Distribution.Normal) },\n        linear: { ...(0,_distribution__WEBPACK_IMPORTED_MODULE_7__.getDistribution)(_distribution__WEBPACK_IMPORTED_MODULE_7__.Distribution.Linear) },\n        exp: { ...(0,_distribution__WEBPACK_IMPORTED_MODULE_7__.getDistribution)(_distribution__WEBPACK_IMPORTED_MODULE_7__.Distribution.Exp) },\n        bernoulli: { ...(0,_distribution__WEBPACK_IMPORTED_MODULE_7__.getDistribution)(_distribution__WEBPACK_IMPORTED_MODULE_7__.Distribution.Bernoulli) },\n    });\n});\napp.get('/api/users', (req, res) => {\n    res.send({ data: users });\n});\napp.use((req, res) => {\n    res.sendFile(path__WEBPACK_IMPORTED_MODULE_1___default().join(__dirname, '..', 'dist-back', 'index.html'));\n});\nlet createEventsTimers = [];\nlet voteEventsTimers = [];\nio.on('connection', (socket) => {\n    console.log('a user connected');\n    socket.on('disconnect', () => {\n        console.log('user disconnected');\n    });\n    socket.on('chat message', (msg) => {\n        console.log('message: ' + msg);\n        io.emit('chat message', msg);\n    });\n    socket.on('vote start', () => {\n        console.log('vote started');\n        votingStatus = true;\n        votingData = initVoting();\n        io.emit('vote start');\n        const nums = (0,_distribution__WEBPACK_IMPORTED_MODULE_7__.getLogNormalDistribution)(10000).nums;\n        const array = Array(20)\n            .fill(0)\n            .map(() => {\n            const randomIndex = random__WEBPACK_IMPORTED_MODULE_6___default().int(0, nums.length);\n            return nums[randomIndex] || 0;\n        });\n        console.log(nums.length);\n        console.log(array);\n        voteEventsTimers = nums.map((el) => {\n            return setTimeout(() => {\n                const events = [EventType.Dislike, EventType.Like];\n                const randomIndex = random__WEBPACK_IMPORTED_MODULE_6___default().int();\n                const event = events[randomIndex];\n                if (event) {\n                    eventsMap[event]();\n                }\n                else {\n                    console.log('error');\n                }\n            }, Math.abs(el - 300) * 1000);\n        });\n        createEventsTimers = array.map((num) => {\n            return setTimeout(() => {\n                const events = [EventType.CreateCon, EventType.CreatePro];\n                const randomIndex = random__WEBPACK_IMPORTED_MODULE_6___default().int();\n                const event = events[randomIndex];\n                if (event) {\n                    eventsMap[event]();\n                }\n                else {\n                    console.log('error');\n                }\n            }, num * 1000);\n        });\n        eventGeneratorTimerId = setInterval(() => {\n            // runRandomEvent();\n        }, 25);\n    });\n    socket.on('vote end', () => {\n        console.log('vote ended');\n        votingStatus = false;\n        io.emit('vote end');\n        createEventsTimers.forEach((timer) => {\n            clearInterval(timer);\n        });\n        voteEventsTimers.forEach((timer) => {\n            clearInterval(timer);\n        });\n        clearInterval(eventGeneratorTimerId);\n    });\n    socket.on('vote status', () => {\n        io.emit('vote status', votingStatus);\n    });\n    socket.on('vote result', () => {\n        if (Date.now() - (votingData?.startDate || 0) >= 300000) {\n            io.emit('vote end');\n        }\n        io.emit('vote result', {\n            pros: votingData?.createdPros,\n            cons: votingData?.createdCons,\n            voteCount: votingData?.voteCount,\n            time: votingData\n                ? convertMillisecondsInTime(Date.now() - votingData.startDate, false)\n                : '0:0',\n        });\n    });\n    socket.on('add pro or con', (data) => {\n        if (!votingData)\n            return;\n        console.log(`add ${data.type}: ${data.text}`);\n        if (data.type === 'pro') {\n            createProEvent(data.text);\n        }\n        else {\n            createConEvent(data.text);\n        }\n    });\n    socket.on('like', (data) => {\n        if (!votingData)\n            return;\n        if (data.type === 'pro') {\n            likeEvent(votingData.createdPros.find((item) => item.id === data.id));\n        }\n        else {\n            likeEvent(votingData.createdCons.find((item) => item.id === data.id));\n        }\n    });\n    socket.on('dislike', (data) => {\n        if (!votingData)\n            return;\n        if (data.type === 'pro') {\n            dislikeEvent(votingData.createdPros.find((item) => item.id === data.id));\n        }\n        else {\n            dislikeEvent(votingData.createdCons.find((item) => item.id === data.id));\n        }\n    });\n});\nserver.listen(port, () => {\n    console.log(`App listening on port ${port}`);\n});\n\n\n//# sourceURL=webpack://client/./index.ts?");

/***/ }),

/***/ "@faker-js/faker":
/*!**********************************!*\
  !*** external "@faker-js/faker" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@faker-js/faker");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("cors");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "platformsh-config":
/*!************************************!*\
  !*** external "platformsh-config" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("platformsh-config");

/***/ }),

/***/ "random":
/*!*************************!*\
  !*** external "random" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("random");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("socket.io");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./index.ts");
/******/ 	
/******/ })()
;