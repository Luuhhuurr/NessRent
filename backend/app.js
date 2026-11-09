const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const { productsDir } = require('./config/multer');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const bookingRoutes = require('./routes/bookings');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');

const app = express();

app.use(
  cors({
    origin: env.cors.origins,
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'running', environment: env.nodeEnv } });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Only product images are public. Identity documents live outside this mount
// and are only reachable through the authenticated admin route.
app.use(
  '/uploads/products',
  express.static(productsDir, {
    maxAge: '1d',
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
        res.setHeader('Content-Type', 'image/jpeg');
      } else if (filePath.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png');
      } else if (filePath.endsWith('.webp')) {
        res.setHeader('Content-Type', 'image/webp');
      }
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    },
  })
);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
