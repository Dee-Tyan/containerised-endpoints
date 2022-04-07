import {
  readBalancesDb,
  readTransactionDb,
  writeBalancesDb,
  writeTransactionDb,
} from '../model/bankdatabases';
import { accountNumberGenerator } from '../model/accnumgen';
import zod, { number, string, ZodObject } from 'zod';
import type { UserTransactions, UserBalances } from '../types';
import { randomUUID } from 'crypto';

//POST | /create-account  | Enable user to create an account stored in the balance table    |
//| GET   | /balance/:accountNumber | Getting balance for a particular account number |
//| GET   | /balance | Getting all accounts and their balance |
//| POST   | /transfer | To make a transaction to another account |

const createAccountSchema = zod.object({
  name: zod.string().min(3),
  location: zod.string().min(4),
  balance: zod.number(),
});

//post to balances db - first create the bank account creation function

export async function createBankAccount(data: Record<string, unknown>) {
  const accountRegistration = createAccountSchema.parse(data);
  const balanceTable = await readBalancesDb();
  const newAccOpening = {
    ...accountRegistration,
    account: accountNumberGenerator(),
    createdAt: new Date().toISOString(),
  };

  balanceTable.push(newAccOpening);

  await writeBalancesDb(JSON.stringify(balanceTable));

  return newAccOpening;
}

//get all balance

export async function getAllBalance() {
  return readBalancesDb();
}

//get amount from balance when an id/account is added to param

export async function getBalance(id: string) {
  let balanceTable = await getAllBalance();

  const exists = balanceTable.findIndex((x) => x.account === id);

  if (exists === -1) {
    throw Error('Account not found');
  }

  return balanceTable[exists].balance;
}

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

const transferDetailsSchema = zod.object({
  senderAccount: zod.string().length(11),
  receiverAccount: zod.string().length(11),
  amount: zod.number(),
  transferDescription: zod.string().min(5),
});

export async function addTransaction(data: Record<string, unknown>) {
  const transfer = transferDetailsSchema.parse(data);

  const balanceTable = await getAllBalance();

  const newTransaction = {
    ...transfer,
    reference: randomUUID(),
    createdAt: new Date().toISOString(),
  };

  //find sender account

  const exists = balanceTable.findIndex(
    (x) => x.account === transfer.senderAccount,
  );

  if (exists === -1) {
    throw Error('Account number does not exist');
  }

  //check transfer condition i.e data.amount < senderaccount balance
  if (balanceTable[exists].balance < transfer.amount) {
    throw Error('Insufficient Funds');
  }

  //add amount to receiver balance amount

  const receiverExists = balanceTable.findIndex(
    (y) => y.account === transfer.receiverAccount,
  );

  if (receiverExists === -1) {
    throw Error("Receiver Account Doesn't Exist");
  }

  balanceTable[receiverExists].balance += transfer.amount;
  balanceTable[exists].balance -= transfer.amount;

  await writeBalancesDb(JSON.stringify(balanceTable));

  let { senderAccount, receiverAccount, amount } = newTransaction;
  
  await writeTransactionDb(JSON.stringify({ senderAccount, receiverAccount, amount }));
  let transactionReceipt = await readTransactionDb()
  return transactionReceipt;
}

