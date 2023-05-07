const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('../config/db.js');
const authRoutes = require('../routes/authRouter.js');
const categoryRoutes = require('../routes/catergoryRoutes.js');
const productRoutes = require('../routes/productRoutes.js');
const cors = require('cors');
// import connectDB from '../config/db.js';
// import authRoutes from '../routes/authRouter.js';
// import cors from 'cors';
// import categoryRoutes from '../routes/catergoryRoutes.js';
// import productRoutes from '../routes/productRoutes.js';
// import serverless from 'serverless-http';

dotenv.config();

const app = express();

(async () => await connectDB())();

//middleware
app.use(cors());
app.use(express.json());

//routes

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);

app.get('/', (req, res) => {
  res.send({
    msg: 'Welcome',
  });
});

const PORT = process.env.PORT || 9000;

app.listen(PORT, (req, res) => {
  console.log('listening on port', PORT);
});
