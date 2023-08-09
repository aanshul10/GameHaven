import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    orderItems: [
        {
            slug: { type: String, required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            //imageUrl: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Product',
              required: true,
            },
        }
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    datePlaced: { type: Date, default: Date.now },
    orderStatus: { 
        type: String, 
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], 
        default: "Processing" 
    },
   
   },
    {
        timestamps: true, 
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
