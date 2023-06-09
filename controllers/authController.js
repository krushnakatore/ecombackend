const userModel = require('../models/userModel.js');
const orderModel = require('../models/orderModel.js');

const {
  hashPassword,
  comparePassword,
} = require('./../helpers/authHelpers.js');
const JWT = require('jsonwebtoken');

const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    //validations
    if (!name) {
      return res.send({ error: 'Name is Required' });
    }
    if (!email) {
      return res.send({ error: 'Email is Required' });
    }
    if (!password) {
      return res.send({ error: 'Password is Required' });
    }
    if (!phone) {
      return res.send({ error: 'Phone no is Required' });
    }
    if (!address) {
      return res.send({ error: 'Address is Required' });
    }
    if (!answer) {
      return res.send({ error: 'Answer is Required' });
    }
    //check user
    const exisitingUser = await userModel.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: true,
        message: 'Already Register please login',
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: 'User Register Successfully',
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Errro in Registeration',
      error,
    });
  }
};

//forgot password

const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    if (!email) {
      return res.send({ error: 'Email is Required' });
    }
    if (!answer) {
      return res.send({ error: 'Answer is Required' });
    }
    if (!newPassword) {
      return res.send({ error: 'New Password is Required' });
    }

    const user = await userModel.find({ email, answer });

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: 'Wrong Email or Answer' });
    }

    const hashed = await hashPassword(newPassword);

    await userModel.findOneAndUpdate(user._id, { password: hashed });

    res
      .status(201)
      .send({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: 'Something went wrong',
      err,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: 'Invalid email or password',
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'Email is not registerd',
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: 'Invalid Password',
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    res.status(200).send({
      success: true,
      message: 'login successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: 'Error in Login',
      err,
    });
  }
};

const testController = (req, res) => {
  try {
    res.send('protected');
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: 'Server error',
      err,
    });
  }
};

const updateProfileController = async (req, res) => {
  try {
    const { name, password, address, phone, email } = req.body;

    const user = await userModel.findById(req.user._id);

    if (!password && password?.length > 6) {
      return res.json({
        error: 'password is required and must be at least 6 characters',
      });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
        email: email || user.email,
      },
      { new: true }
    );

    res.status(201).send({
      success: true,
      message: 'Profile updated successfully',
      updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: 'Error in Updating profile',
      err,
    });
  }
};

const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate('products', '-photo')
      .populate('buyer', 'name');

    res.status(200).send({ success: true, message: 'All Orders', orders });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: 'Error in getting orders', success: false, err });
  }
};

const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate('products', '-photo')
      .populate('buyer', 'name')
      .sort({ createdAt: -1 });

    res.status(200).send({ success: true, message: 'All Orders', orders });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: 'Error in getting orders', success: false, err });
  }
};

const getOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;

    console.log(orderId);
    const { status } = req.body;

    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true }
    );

    res.status(200).send({ success: true, message: 'Status Changed', orders });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: 'Error in getting orders', success: false, err });
  }
};

module.exports = {
  getOrderStatusController,
  getAllOrdersController,
  getOrdersController,
  updateProfileController,
  testController,
  loginController,
  forgotPasswordController,
  registerController,
};
