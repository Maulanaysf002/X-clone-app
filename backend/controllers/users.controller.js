import bcrypt from 'bcryptjs';
import User from '../models/users.model.js';

export const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
    // find user by username in url
    const user = await User.findOne({ username }).select('-password');
    if (!user) res.status(400).json({ erorr: 'user not found' });

    res.status(200).json(user);
  } catch (error) {
    console.log(`erorr in userController : ${error.message}`);
    res.status(500).json({ erorr: 'internal server erorr' });
  }
};

export const updateUser = async (req, res) => {
  const { fullname, email, username, currentPassword, newPassword, bio, link } = req.body;
  let { profileImg, coverImg } = req.body;
  const userId = req.user._id;

  try {
    // query
    let user = await User.findById(userId).select('-password');

    if (!user) return res.status(404).json({ erorr: 'User not found' });

    // change password
    if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
      res.status(400).json({ erorr: 'Please provide both current password and new password' });
    }

    if (currentPassword && newPassword) {
      const isMatch = bcrypt.compare(currentPassword, user.password);
      // password validation
      if (!isMatch) res.status(400).json({ erorr: 'Current password is incorrect' });
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
      }

      // save hashing newPassword
      const salt = bcrypt.salt(10);
      user.password = bcrypt.hash(newPassword, salt);
    }

    // update user data
    user.fullname = fullname || user.fullname;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();

    // send response
    res.status(200).json(user);
  } catch (error) {
    console.log(`erorr in updateUser userController : ${error.message}`);
    res.status(500).json({ erorr: 'internal server erorr' });
  }
};
