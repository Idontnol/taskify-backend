const express = require('express');
const cors = require('cors');  

const app = express();

// Middleware
app.use(express.json());  // Parse incoming JSON requests
app.use(cors());  // Enable Cross-Origin Resource Sharing

// Database connection (optional, if using MongoDB)
mongoose.connect('mongodb://localhost:27017/taskify', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to the database'))
  .catch((error) => console.error('Database connection failed', error));

// Sample route
app.get('/', (req, res) => {
  res.send('Welcome to Taskify API!');
});

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
