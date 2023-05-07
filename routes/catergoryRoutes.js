const express = require('express');
const { isAdmin, reqSignIn } = require('../middlewares/authMiddleware.js');
const {
  categoryController,
  categoryUpdateController,
  deleteCategoryController,
  getAllCategoryController,
  getSingleCategoryController,
} = require('../controllers/categoryController.js');

const router = express.Router();

router.post('/create-category', reqSignIn, isAdmin, categoryController);

router.put(
  '/update-category/:id',
  reqSignIn,
  isAdmin,
  categoryUpdateController
);

router.get('/get-category', getAllCategoryController);

router.get('/single-category/:slug', getSingleCategoryController);

router.delete(
  '/delete-category/:id',
  reqSignIn,
  isAdmin,
  deleteCategoryController
);

module.exports = router;
