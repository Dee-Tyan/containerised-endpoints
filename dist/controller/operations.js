"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTransaction = exports.getBalance = exports.getAllBalance = exports.createBankAccount = void 0;
const bankdatabases_1 = require("../model/bankdatabases");
const accnumgen_1 = require("../model/accnumgen");
const zod_1 = __importDefault(require("zod"));
const crypto_1 = require("crypto");
//POST | /create-account  | Enable user to create an account stored in the balance table    |
//| GET   | /balance/:accountNumber | Getting balance for a particular account number |
//| GET   | /balance | Getting all accounts and their balance |
//| POST   | /transfer | To make a transaction to another account |
const createAccountSchema = zod_1.default.object({
    name: zod_1.default.string().min(3),
    location: zod_1.default.string().min(4),
    balance: zod_1.default.number(),
});
//post to balances db - first create the bank account creation function
async function createBankAccount(data) {
    const accountRegistration = createAccountSchema.parse(data);
    const balanceTable = await (0, bankdatabases_1.readBalancesDb)();
    const newAccOpening = {
        ...accountRegistration,
        account: (0, accnumgen_1.accountNumberGenerator)(),
        createdAt: new Date().toISOString(),
    };
    balanceTable.push(newAccOpening);
    await (0, bankdatabases_1.writeBalancesDb)(JSON.stringify(balanceTable));
    return newAccOpening;
}
exports.createBankAccount = createBankAccount;
//get all balance
async function getAllBalance() {
    return (0, bankdatabases_1.readBalancesDb)();
}
exports.getAllBalance = getAllBalance;
//get amount from balance when an id/account is added to param
async function getBalance(id) {
    let balanceTable = await getAllBalance();
    const exists = balanceTable.findIndex((x) => x.account === id);
    if (exists === -1) {
        throw Error('Account not found');
    }
    return balanceTable[exists].balance;
}
exports.getBalance = getBalance;
//post amount from an id to another entry in the transaction database that matches a certain id
// ```
// {
//     from: account,
//     to: account,
//     amount: money
// }
// ```
//get balance from an id
//add same balance to balance of another and store in amount
//push details of that transaction object to transaction database
const transferDetailsSchema = zod_1.default.object({
    senderAccount: zod_1.default.string().length(11),
    receiverAccount: zod_1.default.string().length(11),
    amount: zod_1.default.number(),
    transferDescription: zod_1.default.string().min(5),
});
async function addTransaction(data) {
    const transfer = transferDetailsSchema.parse(data);
    const balanceTable = await getAllBalance();
    const newTransaction = {
        ...transfer,
        reference: (0, crypto_1.randomUUID)(),
        createdAt: new Date().toISOString(),
    };
    //find sender account
    const exists = balanceTable.findIndex((x) => x.account === transfer.senderAccount);
    if (exists === -1) {
        throw Error('Account number does not exist');
    }
    //check transfer condition i.e data.amount < senderaccount balance
    if (balanceTable[exists].balance < transfer.amount) {
        throw Error('Insufficient Funds');
    }
    //add amount to receiver balance amount
    const receiverExists = balanceTable.findIndex((y) => y.account === transfer.receiverAccount);
    if (receiverExists === -1) {
        throw Error("Receiver Account Doesn't Exist");
    }
    balanceTable[receiverExists].balance += transfer.amount;
    balanceTable[exists].balance -= transfer.amount;
    await (0, bankdatabases_1.writeBalancesDb)(JSON.stringify(balanceTable));
    let { senderAccount, receiverAccount, amount } = newTransaction;
    await (0, bankdatabases_1.writeTransactionDb)(JSON.stringify({ senderAccount, receiverAccount, amount }));
    let transactionReceipt = await (0, bankdatabases_1.readTransactionDb)();
    return transactionReceipt;
}
exports.addTransaction = addTransaction;
//# sourceMappingURL=operations.js.map