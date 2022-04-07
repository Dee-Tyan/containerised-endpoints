import fs from 'fs/promises';
import path from 'path';
import type { UserBalances, UserTransactions } from '../types';

const transactionDbPath = path.join(__dirname, '../../data/transactions.json');
const balancesDbPath = path.join(__dirname, '../../data/balances.json');

export function readTransactionDb(): Promise<UserTransactions[]> {
  return fs.readFile(transactionDbPath, 'utf-8').then((data) => {
    return JSON.parse(data);
  });
}

export function readBalancesDb(): Promise<UserBalances[]> {
  return fs.readFile(balancesDbPath, 'utf-8').then((data) => {
    return JSON.parse(data);
  });
}

export function writeTransactionDb(data: string) {
  return fs.writeFile(transactionDbPath, data);
}

export function writeBalancesDb(data: string) {
  return fs.writeFile(balancesDbPath, data);
}
