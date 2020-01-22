const express = require('express');
const connectDB = require('./config/database');

const cors = require('cors');

const book_routes = require('./routes/book_routes');

const app = express();
connectDB();

// Express's Bodyparser
app.use(express.json({ extended: false }));

app.use(cors());

app.get('', (req, res) => {
  res.sendStatus(200);
});


// The routers
app.use('/', book_routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT} `);
});