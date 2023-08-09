import express from 'express';
import cors from 'cors';
import Order from '../models/OrderModel.js';
import { isAuth, isAdmin } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';

const orderRouter = express.Router();

orderRouter.use( 
    cors({
        credentials: true,
        origin: 'http://localhost:3000'
    })
 )

 orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate('user', 'username');
    res.send(orders);
  })
);

 orderRouter.post('/', isAuth, expressAsyncHandler(async (req, res) => {
    
    if (req.body.orderItems.length === 0) {
        res.status(400).send({ message: 'Cart is empty' });
    } else {
        const newOrder = new Order({
            orderItems: req.body.orderItems.map((x) => ({
                name: x.name,
                slug: x.slug,
                imageUrl:x.imageUrl,
                price: x.price,
                quantity: x.quantity,
                product: x._id
            })),
            user: req.user._id,
        });

        const order = await newOrder.save();
        res.status(201).send({ message: 'New Order Created', order });
    }
}));


orderRouter.get(
    '/mine',
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const orders = await Order.find({ user: req.user._id });
      res.send(orders);
    })
  );


orderRouter.get(
    '/:id',
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const order = await Order.findById(req.params.id);
      if (order) {
        res.send(order);
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      }
    })
  );

  orderRouter.put(
    '/:id/status',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.orderStatus = req.body.status;
            const updatedOrder = await order.save();
            res.send({ message: 'Order Status Updated', order: updatedOrder });
        } else {
            res.status(404).send({ message: 'Order Not Found' });
        }
    })
);

  
  

export default orderRouter;


