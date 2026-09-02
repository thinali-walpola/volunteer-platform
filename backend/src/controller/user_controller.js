import { User } from '../models/user_model.js';
import bcrypt from 'bcryptjs';

const registerUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        const newUser = new User({
            username,
            password,
            email: email.toLowerCase()
        });

        await newUser.save();

        res.status(201).json({
            message: 'User created successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error creating user',
            error: error.message
        });
    }
};
const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email: email.toLowerCase()});
        if(!user){
            return res.status(404).json({
                message: 'User not found'
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }
        res.status(200).json({
            message: 'Login successful'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error logging in',
            error: error.message
        });
    }
};
export { registerUser, loginUser };
