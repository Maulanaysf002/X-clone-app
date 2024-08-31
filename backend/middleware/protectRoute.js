import User from '../models/users.model.js';
import jwt from 'jsonwebtoken';

export const protectRoute = async (req, res, next) => {
  try {
    // jwt token validation
    const token = req.cookies.jwt;
    if (!token) {
      res.status(400).json({ erorr: 'Unauthorized: No Token Provided' });
    }

    // decode jwt token
    const decode = jwt.decode(token, process.env.JWT_SECRET);
    if (!decode) {
      res.status(400).json({ erorr: 'Unauthorized: Invalid Token' });
    }

    // find user with id in jwt
    const user = await User.findById(decode.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
