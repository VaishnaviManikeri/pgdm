const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ================= TRUST PROXY =================
app.set('trust proxy', 1);

// ================= CORS CONFIG =================
const allowedOrigins = [
  'http://localhost:5173',
  'https://adityainstitutepgdm.com',
  'https://www.adityainstitutepgdm.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true
}));

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= ROUTES =================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/notices', require('./routes/noticeRoutes'));
app.use('/api/careers', require('./routes/careerRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));

// ================= HEALTH CHECK =================
app.get('/', (req, res) => {
  res.send('PGDM Backend Running 🚀');
});

// ================= DATABASE =================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

// ================= CREATE ADMIN =================
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ email: 'admin@example.com' });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);

      await new Admin({
        email: 'admin@example.com',
        password: hashedPassword
      }).save();

      console.log('Admin created: admin@example.com / admin123');
    }
  } catch (err) {
    console.log('Admin error:', err);
  }
};

createAdmin();

// ================= SERVER =================
const PORT = 5013;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
