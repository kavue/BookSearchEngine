import UserModel from '../models/User.js';
import { signToken } from '../services/auth.js';
export const resolvers = {
    Query: {
        me: async (_, __, { user }) => {
            if (!user)
                throw new Error('You must be logged in');
            return await UserModel.findById(user._id);
        },
    },
    Mutation: {
        addUser: async (_, { username, email, password }) => {
            try {
                const user = await UserModel.create({ username, email, password });
                const token = signToken(user.email, user._id);
                return { token, user };
            }
            catch (err) {
                console.error(err);
                throw new Error('Error creating user');
            }
        },
        login: async (_, { email, password }) => {
            try {
                const user = await UserModel.findOne({ email });
                if (!user || !(await user.isCorrectPassword(password))) {
                    throw new Error('Invalid credentials');
                }
                const token = signToken(user.email, user._id);
                return { token, user };
            }
            catch (err) {
                console.error(err);
                throw new Error('Error logging in');
            }
        },
        saveBook: async (_, { bookData }, { user }) => {
            if (!user)
                throw new Error('You must be logged in');
            try {
                return await UserModel.findByIdAndUpdate(user._id, { $addToSet: { savedBooks: bookData } }, { new: true, runValidators: true });
            }
            catch (err) {
                console.error(err);
                throw new Error('Error saving book');
            }
        },
        removeBook: async (_, { bookId }, { user }) => {
            if (!user)
                throw new Error('You must be logged in');
            try {
                return await UserModel.findByIdAndUpdate(user._id, { $pull: { savedBooks: { bookId } } }, { new: true });
            }
            catch (err) {
                console.error(err);
                throw new Error('Error removing book');
            }
        },
    },
};
export default resolvers;
