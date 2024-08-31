import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';
import User from '../models/users.model.js';
import bcrypt from 'bcryptjs';

// make signup controller
export const signup = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    // email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ erorr: 'Invalid email format' });
    }

    // existing user
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({ erorr: 'username is already taken' });
    }

    // existing email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ erorr: 'email is already used' });
    }

    // password validation
    if (password.length < 6) {
      res.status(400).json({ error: 'password must be at least 6 character long' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // add User to database
    const newUser = new User({
      fullname: fullname,
      username: username,
      email: email,
      password: hashedPassword,
    });

    if (newUser) {
      // make jwt token
      generateTokenAndSetCookie(newUser._id, res);
      // save to database
      await newUser.save();

      // send res to client
      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      // erorr invalid create user
      res.status(400).json({ erorr: 'Invalid User Data' });
    }
  } catch (error) {
    console.log(erorr.message);
    // server error
    res.status(500).json({ erorr: 'Internal Server Error' });
  }
};

// make login controller
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // find user data and validation
    const user = await User.findOne({ username });
    const isPasswordValid = await bcrypt.compare(password, user?.password || ''); // chek valid password

    // chek username and password
    if (!user || !isPasswordValid) {
      res.status(400).json({ erorr: 'invalid username or password' });
    }

    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    console.log(error.message);
    // server error
    res.status(500).json({ erorr: 'Internal Server Error' });
  }
};

// make logout controller
export const logout = async (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ message: 'you are logout' });
  } catch (error) {
    console.log(error.message);
    // server error
    res.status(500).json({ erorr: 'Internal Server Error' });
  }
};

// get the user data who have jwt token
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    console.log('Error in getMe controller', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
