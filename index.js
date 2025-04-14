const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const prisma = require('./prisma');
const authRoutes = require('./routes/auth');
const orgRoutes = require('./routes/organization');
const taskRoutes = require('./routes/tasks');

const app = express();


app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173'}));
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
  })
);


app.use('/api/auth', authRoutes);
app.use('/api/org', orgRoutes);
app.use('/api/tasks', taskRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));