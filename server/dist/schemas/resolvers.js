import UserModel from '../models/User.js';
import { signToken } from '../services/auth.js';
export const resolvers = {
    Query: {
        me: async (_, __, { user }) => {
            if (!user)
                return null;
            return await UserModel.findById(user._id);
        },
    },
    Mutation: {
        addUser: async (_, { username, email, password }) => {
            console.log('Received input:', { username, email, password });
            if (!username || !email || !password) {
                throw new Error('All fields are required!');
            }
            // Check if the username already exists
            const existingUser = await UserModel.findOne({ username });
            if (existingUser) {
                throw new Error('Username already taken');
            }
            try {
                // Create the new user
                const user = await new UserModel({ username, email, password }).save();
                if (!user || !user._id)
                    throw new Error("User creation failed");
                const token = signToken(user.email, user._id.toString());
                return { token, user };
            }
            catch (err) {
                console.error(err);
                throw new Error('Error creating user');
            }
        },
        login: async (_, { email, password }) => {
            if (!email || !password)
                throw new Error('Email and password are required');
            try {
                const user = await UserModel.findOne({ email });
                if (!user)
                    throw new Error('User not found');
                const isValid = await user.isCorrectPassword(password);
                if (!isValid)
                    throw new Error('Invalid credentials');
                const token = signToken(user.email, user._id.toString());
                return { token, user };
            }
            catch (err) {
                console.error(err);
                throw new Error('Error logging in');
            }
        },
        saveBook: async (_, { bookData }, { user }) => {
            if (!user || !user._id)
                throw new Error('You must be logged in');
            try {
                const updatedUser = await UserModel.findByIdAndUpdate(user._id.toString(), { $addToSet: { savedBooks: bookData } }, { new: true, runValidators: true });
                if (!updatedUser)
                    throw new Error('User not found');
                return updatedUser;
            }
            catch (err) {
                console.error(err);
                throw new Error('Error saving book');
            }
        },
        removeBook: async (_, { bookId }, { user }) => {
            if (!user || !user._id)
                throw new Error('You must be logged in');
            try {
                const updatedUser = await UserModel.findByIdAndUpdate(user._id.toString(), { $pull: { savedBooks: { bookId } } }, { new: true });
                if (!updatedUser)
                    throw new Error('User not found');
                return updatedUser;
            }
            catch (err) {
                console.error(err);
                throw new Error('Error removing book');
            }
        },
    },
};
export default resolvers;
