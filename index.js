const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const bodyParser = require('body-parser');
 
const app = express();

app.use(express.json());
app.use(bodyParser.json());
const secretKey = "fingerprint_customer";
app.use(session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}));
// Middleware to verify JWT on subsequent requests
const verifyToken = (req, res, next) => {
    // const token = req.header('Authorization');
  
    // if (!token) {
    //   return res.status(401).json({ error: 'No token provided' });
    // }

    // console.log(token, secretKey);
  
    // jwt.verify(token, secretKey , (err, decoded) => {
    //     console.log(err);
    //   if (err) {
    //     console.error('Error while verifying token:', err.message);
    //     return res.status(401).json({ error: 'Invalid token' });
    //   }
  
    //   // The token is valid, proceed with the request
    //   console.log("decoded", decoded);
    //   req.user = decoded;
    //   next();
    // });

    if(req.session.authorization) {
        let token = req.session.authorization['accessToken']; // Access Token
        jwt.verify(token, "access",(err,user)=>{
            if(!err){
                req.user = user;
                console.log(user);
                next();
            }
            else{
                return res.status(403).json({message: "User not authenticated"})
            }
         });
     } else {
         return res.status(403).json({message: "User not logged in"})
     }
  };

app.use("/customer/auth/*", verifyToken );
const PORT =5000;

app.use("/customer", verifyToken, customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));