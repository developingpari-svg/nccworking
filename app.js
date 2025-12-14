const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 3000;

const multer = require('multer');
const jwt=require("jsonwebtoken")
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const usermodel = require('./models/user');
const Post = require('./models/post');
const Product = require('./models/product');


const mongoose = require('mongoose');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g., 123456789.jpg
  }
});

const upload = multer({ storage: storage });


// Set EJS as the view engine
app.set('view engine', 'ejs');

// Optional: set the views folder (default is ./views)
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/loginhere',(req,res)=>{//================
  res.render("form");
 });
app.post('/register', async (req, res) => {
  let { email, password, username, name, age } = req.body;

  const user = await usermodel.findOne({ email }); // ✅ FIXED
  if (user) return res.status(409).redirect('/login');

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let user = await usermodel.create({
        name,
        username,
        age,
        email,
        password: hash
      });

      let token = jwt.sign(
        { email: email, userid: user._id },
        'shhhh',

      );

      res.cookie('token', token);
      res.render('profile',{user});
    });
  });
});
app.post('/login', async (req, res) => {
    let { email, password } = req.body;

    const user = await usermodel.findOne({ email });
    if (!user) return res.redirect('/'); // redirect to register page listen we dont have anything in register route

    // compare password
    bcrypt.compare(password, user.password, (err, result) => {
        if (err) return res.status(500).send('Internal Server Error');

        if (result) {
            // password matched
            let token = jwt.sign({ email, userid: user._id }, 'shhhh', { expiresIn: '1d' });
            res.cookie('token', token, { httpOnly: true });
            return res.render('profile'); // ✅ redirect to a page after login
        } else {
            // password mismatch
            return res.redirect('/loginhere');
        }
    });
});
app.post('/create-post',isLoggedIn ,upload.single('photo'), async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.file) return res.send('❌ No file uploaded');

    const post = new Post({
      title,
      description,
      image: req.file.filename,
      // user: req.user._id  // if you implement authentication
    });

    await post.save();
    res.send('✅ Post created and saved in DB');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});
app.get('/logout',(req,res)=>{
  res.cookie('token','')
  res.redirect("/loginhere")
})
// A simple route to render an EJS page
function isLoggedIn(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).redirect('/login');
    }

    try {
        const data = jwt.verify(token, 'shhhh');
        req.user = data; // attach user info to request
        next(); // proceed to next middleware/route
    } catch (err) {
        return res.status(401).send('Invalid or expired token');
    }
} 
// make sure you import your model

app.post('/create', async (req, res) => {
  try {
    const { name, price, description, photo } = req.body;

    // Check if product already exists
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).send('Product already exists');
    }

    // Create new product
    const newProduct = new Product({
      name,
      price,
      shortDescription: description,
      photo
    });

    await newProduct.save();
    res.send('✅ Product created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});