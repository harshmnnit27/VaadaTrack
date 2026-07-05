const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const dns = require('dns');

// Fix for MongoDB querySrv ECONNREFUSED in certain network environments
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = require('./config/db');

dotenv.config();
connectDB();

const corsOptions = {
  origin: [
    'http://localhost:3000',
    process.env.FRONTEND_URL,
    // Add Vercel preview domains if needed, or simply let the FRONTEND_URL handle the production domain.
  ].filter(Boolean),
  credentials: true,
};
const app = express();

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/parties', require('./routes/partyRoutes'));
app.use('/api/promises', require('./routes/promiseRoutes'));
app.use('/api/manifestos', require('./routes/manifestoRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

app.get('/', (req, res) => res.json({ message: 'VaadaTrack API Running' }));

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
