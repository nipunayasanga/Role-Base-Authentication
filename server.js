
const express = require('express'); 
const mongoose = require('mongoose'); 
const authRoutes = require('./routes/auth'); 
const dotenv = require('dotenv'); 
const cors = require('cors'); 
//const { authenticateToken } = require('./middleware/auth'); // Import JWT authentication middleware

const app = express(); 


dotenv.config();

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected')) 
.catch(err => console.error(err)); 

// Middleware
app.use(express.json()); 
app.use(cors()); 



// Define Routes
app.use('/api/auth', authRoutes); // Mount the authentication routes at the /api/auth endpoint


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); 

