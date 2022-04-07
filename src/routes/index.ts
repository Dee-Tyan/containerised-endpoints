import express from 'express';
import httpStatus from 'http-status';
import { z } from 'zod';
import {
  getBalance,
  getAllBalance,
  createBankAccount,
  addTransaction,
} from '../controller/operations';
const router = express.Router();

router.get('/balances', async function (req, res) {
  const allAccHolders = await getAllBalance();
  res.status(200).json({ allAccHolders });
});

router.post('/', async function (req, res) {
  const createAcc = req.body;
  try {
    const newUser = await createBankAccount(createAcc);
    res.status(201).json({ newUser });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(httpStatus.BAD_REQUEST).json({ error: err.flatten() });
      //res.status(404).json({ error: "Can't create account at the moment" });
    }
  }
});

router.get('/account/:id', async function (req, res) {
  const checkedAcc = req.params.id;
  try {
    const balance = await getBalance(checkedAcc);

    res.status(200).json({ balance });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(httpStatus.NOT_FOUND).json({ error: err.flatten() });
      //res.status(404).json({ error: 'Fetch Failed' });
    }
  }
});

router.post('/transaction', async function (req, res) {
  try {
    const details = req.body;
    const transactionReceipt = await addTransaction(details);
    res.status(201).json({ transactionReceipt });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(httpStatus.NOT_IMPLEMENTED).json({ error: err.flatten() });
      //res.status(404).json({ error: 'Transaction not processed' });
    }
  }
});

export default router;
