"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const zod_1 = require("zod");
const operations_1 = require("../controller/operations");
const router = express_1.default.Router();
router.get('/balances', async function (req, res) {
    const allAccHolders = await (0, operations_1.getAllBalance)();
    res.status(200).json({ allAccHolders });
});
router.post('/', async function (req, res) {
    const createAcc = req.body;
    try {
        const newUser = await (0, operations_1.createBankAccount)(createAcc);
        res.status(201).json({ newUser });
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            res.status(http_status_1.default.BAD_REQUEST).json({ error: err.flatten() });
            //res.status(404).json({ error: "Can't create account at the moment" });
        }
    }
});
router.get('/account/:id', async function (req, res) {
    const checkedAcc = req.params.id;
    try {
        const balance = await (0, operations_1.getBalance)(checkedAcc);
        res.status(200).json({ balance });
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            res.status(http_status_1.default.NOT_FOUND).json({ error: err.flatten() });
            //res.status(404).json({ error: 'Fetch Failed' });
        }
    }
});
router.post('/transaction', async function (req, res) {
    try {
        const details = req.body;
        const transactionReceipt = await (0, operations_1.addTransaction)(details);
        res.status(201).json({ transactionReceipt });
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            res.status(http_status_1.default.NOT_IMPLEMENTED).json({ error: err.flatten() });
            //res.status(404).json({ error: 'Transaction not processed' });
        }
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map