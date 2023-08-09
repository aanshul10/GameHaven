import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils.js';
import Product from '../models/productModel.js';
import cors from 'cors';

const productRouter = express.Router();

productRouter.use( 
    cors({
        credentials: true,
        origin: 'http://localhost:3000'
    })
)

// to add logic to query adatabse using mongoose functions, when defining the filters

productRouter.get('/', async (req, res) => {
    const products = await Product.find();
    res.send(products);
});

// POST - Create new product
productRouter.post('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const newProduct = new Product({
        name: req.body.name || 'sample name ' + Date.now(),
        slug: req.body.slug || 'sample-slug-' + Date.now(),
        description: req.body.description || 'sample description',
        price: req.body.price || 0,
        imageUrl: req.body.imageUrl || '/images/p1.jpg',
        stockCount: req.body.stockCount || 0,
        category: req.body.category || 'sample category',
        console: req.body.console || 'sample console'
    });
    const product = await newProduct.save();
    res.send({ message: 'Product Created', product });
}));

// PUT - Update existing product
productRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        product.name = req.body.name || product.name;
        product.slug = req.body.slug || product.slug;
        product.description = req.body.description || product.description;
        product.price = req.body.price || product.price;
        product.imageUrl = req.body.imageUrl || product.imageUrl;
        product.stockCount = req.body.stockCount || product.stockCount;
        product.category = req.body.category || product.category;
        product.console = req.body.console || product.console;
        
        await product.save();
        res.send({ message: 'Product Updated', product });
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
}));

// DELETE - Remove product
//productRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
 //   const product = await Product.findById(req.params.id);
 //   if (product) {
 //       await product.remove();
  //      res.send({ message: 'Product Deleted' });
  //  } else {
  //      res.status(404).send({ message: 'Product Not Found' });
  //  }
//}));

productRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (deletedProduct) {
        res.send({ message: 'Product Deleted', product: deletedProduct });
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
}));


productRouter.get(
    '/admin',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const products = await Product.find();
      res.send({ products });
    })
  );
  
productRouter.get('/:id', expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
}));

productRouter.get('/slug/:slug', async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  });

//uses as filter for catergory and console the games play on
productRouter.get(
    '/categories',
    expressAsyncHandler(async (req, res) => {
      const categories = await Product.find().distinct('category');
      res.send(categories);
    })
  );

  productRouter.get('/category/:category', expressAsyncHandler(async (req, res) => {
    const category = req.params.category;
    const products = await Product.find({category});
    res.send(products);
}));

productRouter.get('/console/:console', expressAsyncHandler(async (req, res) => {
    const console = req.params.console;
    const products = await Product.find({ console : console });
    res.send(products);
}));

productRouter.post('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        imageUrl: req.body.imageUrl,
        stockCount: req.body.stockCount,
        category: req.body.category,
    });
    const createdProduct = await product.save();
    res.send({ message: 'Product Created', product: createdProduct });
}));

productRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
        product.name = req.body.name;
        product.description = req.body.description;
        product.price = req.body.price;
        product.imageUrl = req.body.imageUrl;
        product.stockCount = req.body.stockCount;
        product.category = req.body.category;
        const updatedProduct = await product.save();
        res.send({ message: 'Product Updated', product: updatedProduct });
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
}));

productRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product && product instanceof Product) {
        const deleteProduct = await product.remove();
        res.send({ message: 'Product Deleted', product: deleteProduct });
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
}));


export default productRouter;
