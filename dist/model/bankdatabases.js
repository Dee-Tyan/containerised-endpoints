"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeBalancesDb = exports.writeTransactionDb = exports.readBalancesDb = exports.readTransactionDb = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const transactionDbPath = path_1.default.join(__dirname, '../../data/transactions.json');
const balancesDbPath = path_1.default.join(__dirname, '../../data/balances.json');
function readTransactionDb() {
    return promises_1.default.readFile(transactionDbPath, 'utf-8').then((data) => {
        return JSON.parse(data);
    });
}
exports.readTransactionDb = readTransactionDb;
function readBalancesDb() {
    return promises_1.default.readFile(balancesDbPath, 'utf-8').then((data) => {
        return JSON.parse(data);
    });
}
exports.readBalancesDb = readBalancesDb;
function writeTransactionDb(data) {
    return promises_1.default.writeFile(transactionDbPath, data);
}
exports.writeTransactionDb = writeTransactionDb;
function writeBalancesDb(data) {
    return promises_1.default.writeFile(balancesDbPath, data);
}
exports.writeBalancesDb = writeBalancesDb;
//# sourceMappingURL=bankdatabases.js.map