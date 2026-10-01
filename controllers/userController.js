const bcrypt = require("bcryptjs");
const User = require("../models/User");

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    const user = await User.findById(req.userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    if (email && email.toLowerCase() !== user.email) {
      const emailExists = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: user._id }
      });

      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Email is already registered by another user."
        });
      }

      user.email = email.toLowerCase();
    }

    if (name !== undefined) user.name = name;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
