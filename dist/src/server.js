"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use('/playwright-report', express_1.default.static(path_1.default.join(__dirname, '../playwright-report')));
app.post('/run-tests', (req, res) => {
    const { type = 'test' } = req.body;
    (0, child_process_1.exec)(`npm run ${type}`, (error, stdout, stderr) => {
        if (error) {
            res.status(500).send(stdout + '\n' + stderr);
            return;
        }
        res.send(stdout);
    });
});
app.listen(port, () => {
    console.log(`Test runner interface available at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map