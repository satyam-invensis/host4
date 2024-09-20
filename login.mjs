import express from 'express';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { stringToHash, verifyHash } from 'bcrypt-inzi';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, '../LoginPage')));



// Routes for CSV Data Processing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'index.html'));
});


// Database Connection
const dbURI = process.env.MONGODB_URI || `mongodb+srv://satyam149sharma:satyam2000@hscodes.78y8n.mongodb.net/HS_Codes?retryWrites=true&w=majority`;

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // timeout after 5 seconds
})
    .then(() => console.log('Mongoose is connected'))
    .catch(err => {
        console.error('Mongoose connection error:', err);
        process.exit(1);
    });

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose is disconnected');
});

mongoose.connection.on('error', err => {
    console.error('Mongoose connection error:', err);
    process.exit(1);
});

process.on('SIGINT', () => {
    console.log('App is terminating');
    mongoose.connection.close(() => {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});

// User Schema
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
});

const userModel = mongoose.model('User', userSchema);

// Signup Route
app.post('/signup', async (req, res) => {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
        return res.status(400).json({
            message: 'Required fields missing',
            example: {
                fullName: 'John Doe',
                username: 'johndoe',
                email: 'abc@abc.com',
                password: '12345',
            },
        });
    }

    try {
        const existingUser = await userModel.findOne({ email }).exec();

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists. Please try a different email.' });
        }

        const hashedPassword = await stringToHash(password);
        const newUser = new userModel({
            fullName,
            username,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully.' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Required fields missing',
            example: {
                email: 'abc@abc.com',
                password: '12345',
            },
        });
    }

    try {
        console.log(`Login attempt with email: ${email}`);
        const user = await userModel.findOne({ email: email.toLowerCase() }).exec();

        if (!user) {
            console.log('User not found in the database');
            return res.status(404).json({ message: 'User not found.' });
        }

        console.log('User found:', user);
        const isPasswordValid = await verifyHash(password, user.password);

        if (!isPasswordValid) {
            console.log('Invalid password');
            return res.status(401).json({ message: 'Incorrect password.' });
        }

        res.status(200).json({
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            message: 'Login successful.',
            redirectUrl: 'https://host3-5.onrender.com',
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
