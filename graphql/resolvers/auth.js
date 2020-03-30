const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
    createUser: async args => {
        const { userInput } = args;
        const { name, surname, email, password } = userInput;
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error('User already exist');
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({ name, surname, email, password: hashedPassword });
            const result = await user.save();
            return { ...result._doc, password: null, _id: result.id };
        } catch (err) {
            throw err;
        }
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('User does not exist');
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password is incorrect');
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            'somesupersecretkey',
            {
                expiresIn: '24h'
            }
        );
        return { userId: user.id, token: token, tokenExpiration: 24 };
    }
};