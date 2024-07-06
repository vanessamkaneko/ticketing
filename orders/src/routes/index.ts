import { requireAuth } from '@vmktickets/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id
  }).populate('ticket') // p/ retornar infos do ticket (title e price) que essa order se refere; senão só retorna o id do ticket
  
  res.send(orders)
})

export { router as indexOrderRouter }