const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const BlockHash = require('./models/BlockHash');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();

mongoose.connect('mongodb://localhost:27017/blockchain', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }
    if (password !== user.password) { // Check password directly without hashing
      return res.status(401).send('Invalid email or password');
    }
req.session.userId = user._id;
   res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/dashboard', (req, res) => {
  // Render the dashboard.ejs file and pass any necessary data
  res.render('dashboard');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send('User already exists');
    }
    const newUser = new User({ email, password }); // Save password directly without hashing
    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/storeBlockHash', async (req, res) => {
  try {
    const { blockHash } = req.body;
    const userId = req.session.userId; // Get user ID from session

    if (!userId) {
      return res.status(401).send('Unauthorized');
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    await BlockHash.findOneAndUpdate(
      { user: userId },
      { $push: { hashes: blockHash } },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Block hash stored successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error storing block hash.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});