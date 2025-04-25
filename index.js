const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const prisma = require('./prisma');
const authRoutes = require('./routes/adminRouter');
const taskRoutes = require('./routes/tasks');
const dotenv = require('dotenv')
const userRoute = require('./routes/userRouter')

dotenv.config()

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


app.use('/', authRoutes);
app.use('/', taskRoutes);
app.use('/', userRoute)



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));