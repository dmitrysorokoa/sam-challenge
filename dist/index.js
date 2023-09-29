"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path = require("path");
const app = (0, express_1.default)();
const config = require('platformsh-config').config();
const port = !config.isValidPlatform() ? 3003 : config.port;
app.use(express_1.default.static(path.join(__dirname, "client", "build")));
app.use(express_1.default.static("public"));
app.get('/api/test', (req, res) => {
    res.send({ data: 'test bla1' });
});
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
