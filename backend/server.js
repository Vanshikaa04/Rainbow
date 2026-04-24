const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();


const allowedOrigins = [
   "http://localhost:3000",
   "http://localhost:5173",
    "https://rainbow-backend-jet.vercel.app/",


  ];
  
  const corsOptions = {
    origin: function (origin, callback) {
      // Allow non-browser tools like Postman
      if (!origin) return callback(null, true);
  
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(' CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // if using cookies or Authorization headers
  };
  
  app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/products',   require('./routes/products'));
app.use('/api/admin',      require('./routes/admin'));
app.use('/api/categories', require('./routes/categories'));

app.get('/', (req, res) => res.json({ message: '🌈 Rainbow API running' }));

// MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas connected'))
  .catch(err => { console.error('❌ MongoDB error:', err.message); process.exit(1); });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));