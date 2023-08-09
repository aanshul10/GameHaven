import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import {users, products} from './populate.js';
import Product from './models/productModel.js';
import User from './models/userModel.js';

//in command line type node seed.js (to populate mongodb with products from data.js)
dotenv.config();

mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once('open', async () => {
    console.log("MongoDB database connection established successfully");

    try {
        // Clear out any old data
        await Product.deleteMany({});

        // Insert the new data
        const insertedProducts = await Product.insertMany(products);

        console.log(`Data import SUCCESS! ${insertedProducts.length} records inserted.`);
    } catch (error) {
        console.error('Data import FAILURE!', error);
        process.exit(1);
    }
    try {
        // Optional: Clear out any old user data
        await User.deleteMany({});

        // Hash the password for the admin user
        const salt = await bcrypt.genSalt(10);
        users[0].password = await bcrypt.hash(users[0].password, salt);

        // Insert the new user
        const insertedUser = await User.insertMany(users);
        console.log(`User import SUCCESS! ${insertedUser.length} user(s) inserted.`);
    } catch (error) {
        console.error('User import FAILURE!', error);
        process.exit(1);
    }
    process.exit();
});
