const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cron = require('node-cron');
require('dotenv').config();

const routes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');
const StreakService = require('./services/streak.service');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api', routes);

// Error handling middleware
app.use(errorHandler);

// Schedule streak reset at 9:00 AM daily
cron.schedule('0 9 * * *', async () => {
  try {
    const resetCount = await StreakService.resetInactiveStreaks();
    console.log(`Streak reset completed. ${resetCount} users affected.`);
  } catch (error) {
    console.error('Error in streak reset cron job:', error);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 