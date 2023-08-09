import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    stockCount: { type: Number, default: 0 },
    category: { type: String, required: true },
    console: {type:String, required: true}
    //may have to chamge type of ctaergory to enum, so only 
    //certain options of string as chosen from
    //may ahve to add slug to open individual items
});

const Product = mongoose.model('Product', productSchema);
export default Product;
