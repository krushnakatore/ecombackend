const express = require('express');
const {
  braintreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFilterController,
  productListController,
  productPhotoController,
  productSearchController,
  productSimilarController,
  updateProductController,
} = require('../controllers/productController.js');
const { isAdmin, reqSignIn } = require('../middlewares/authMiddleware.js');
const ExpressFormidable = require('express-formidable');

const router = express.Router();

router.post(
  '/create-product',
  reqSignIn,
  isAdmin,
  ExpressFormidable(),
  createProductController
);

router.get('/get-product', getProductController);

router.get('/get-product/:slug', getSingleProductController);

router.get('/product-photo/:id', productPhotoController);

router.delete('/delete-product/:id', deleteProductController);

router.put(
  '/update-product/:id',
  reqSignIn,
  isAdmin,
  ExpressFormidable(),
  updateProductController
);

router.post('/filter-product', productFilterController);

router.get('/product-count', productCountController);

router.get('/product-list/:page', productListController);

router.get('/product-search/:keyword', productSearchController);

router.get('/product-similar/:pid/:cid', productSimilarController);

router.get('/product-categorywise/:category', productCategoryController);

//payment router

router.get('/braintree/token', braintreeTokenController);

router.post('/braintree/payment', reqSignIn, braintreePaymentController);

module.exports = router;
