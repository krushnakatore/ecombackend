const express = require('express');
const {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  getOrderStatusController,
} = require('../controllers/authController.js');
const { reqSignIn, isAdmin } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.post('/register', registerController);

router.post('/login', loginController);

//forget password

router.post('/forgot-password', forgotPasswordController);

// protected routes

router.get('/protected', reqSignIn, isAdmin, testController);

router.get('/user-auth', reqSignIn, async (req, res) => {
  res.status(200).send({ ok: true });
});

router.get('/admin-auth', reqSignIn, async (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile

router.put('/update-profile', reqSignIn, updateProfileController);

router.get('/orders', reqSignIn, getOrdersController);

router.get('/all-orders', reqSignIn, isAdmin, getAllOrdersController);

router.put(
  '/order-status/:orderId',
  reqSignIn,
  isAdmin,
  getOrderStatusController
);

module.exports = router;
