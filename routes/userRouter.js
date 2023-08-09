import express from 'express';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import { generateToken } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';

const userRouter = express.Router();

userRouter.use( 
    cors({
        credentials: true,
        origin: 'http://localhost:3000'
    })
)

userRouter.post('/signup', expressAsyncHandler (async (req, res) => {
    const { username, email, password } = req.body;
    const emailExists = await User.findOne({ email });
    const userExists = await User.findOne({ username });
    
    if (password.length < 6) {
        res.status(400);
        throw new Error('Password should be at least 6 characters');
    }

    if (emailExists) {
        res.status(400);
        throw new Error('Email already in use');
    }
    if (userExists) {
        res.status(400);
        throw new Error('Username already exists');
    }

    const user = new User({
        username,
        email,
        password,
        isAdmin: false,
    });

    const createdUser = await user.save();

    res.status(201).send({
        _id: createdUser._id,
        username: createdUser.username,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        token: generateToken(createdUser),
    });
}));

userRouter.post('/signin', expressAsyncHandler (async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.send({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
}));

export default userRouter;
