import UserModel from '../models/User.js';
import { signToken } from '../services/auth.js';

interface User extends Document{
    _id: string;
    username: string;
    email: string;
    savedBooks?: any[];
    isCorrectPassword: (password: string) => Promise<boolean>;
}

interface Context {
    user?: User | null;
}

interface BookInput {
    bookId: string;
    title: string;
    authors: string[];
    description?: string;
    image?: string;
    link?: string;
}

export const resolvers = {
    Query: {
        me: async (_: any, __: any, { user }: Context) => {
            if (!user) return null;
            return await UserModel.findById(user._id);
        },
    },

    Mutation: {
        addUser: async (_: any, { username, email, password }: { username: string, email: string, password: string }) => {
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
                if (!user || !user._id) throw new Error("User creation failed");
        
                const token = signToken(user.email, user._id.toString());
                return { token, user };
            } catch (err) {
                console.error(err);
                throw new Error('Error creating user');
            }
        },

        login: async (_: any, { email, password }: { email: string, password: string }) => {
            if (!email || !password) throw new Error('Email and password are required');

            try {
                const user = await UserModel.findOne({ email }) as User | null; 
                if (!user) throw new Error('User not found');

                const isValid = await user.isCorrectPassword(password);
                if (!isValid) throw new Error('Invalid credentials');

                const token = signToken(user.email, user._id.toString());
                return { token, user };
            } catch (err) {
                console.error(err);
                throw new Error('Error logging in');
            }
        },

        saveBook: async (_: any, { bookData }: { bookData: BookInput }, { user }: Context) => {
            if (!user || !user._id) throw new Error('You must be logged in');

            try {
                const updatedUser = await UserModel.findByIdAndUpdate(
                    user._id.toString(), 
                    { $addToSet: { savedBooks: bookData } },
                    { new: true, runValidators: true }
                );

                if (!updatedUser) throw new Error('User not found');
                return updatedUser;
            } catch (err) {
                console.error(err);
                throw new Error('Error saving book');
            }
        },

        removeBook: async (_: any, { bookId }: { bookId: string }, { user }: Context) => {
            if (!user || !user._id) throw new Error('You must be logged in');

            try {
                const updatedUser = await UserModel.findByIdAndUpdate(
                    user._id.toString(),
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );

                if (!updatedUser) throw new Error('User not found');
                return updatedUser;
            } catch (err) {
                console.error(err);
                throw new Error('Error removing book');
            }
        },

    },
};

export default resolvers;
