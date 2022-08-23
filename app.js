const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const passport = require('passport');
// const localStrategy = require('passport-local');
const User = require('./models/user')
const mongoDB = 'mongodb+srv://toru1038:pGXZiaulpJd5sigw@angular.l8hkt.mongodb.net/?retryWrites=true&w=majority'
const userRouter = require('./routes/routes');
// require('./config/passport');



dotenv.config();
app.use(cors())
app.use(express.json());
app.use(bodyParser.json());

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, ()=>{
 
  console.log(`DB connected`);
})

// pass required stuff
app.use(passport.initialize());
// passport.use(new localStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser())
// passport.deserializeUser(User.deserializeUser())

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
// extract jwt from header
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.TOKEN_SECRET;
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log(jwt_payload.username);
    console.log(jwt_payload.id);
    User.findOne({_id: jwt_payload.id}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));

const posts = [
    {
        "userId": 1,
        "id": 1,
        "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
      },
      {
        "userId": 1,
        "id": 2,
        "title": "qui est esse",
        "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
      },
      {
        "userId": 1,
        "id": 3,
        "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
        "body": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut"
      },
]

// app.get('/posts', authenticateToken,async (req, res)=>{
//      res.json(req.user);
// });

app.get('/protected', passport.authenticate('jwt', {session:false}), async(req, res)=>{
  console.log(req.user.username);
  res.status(200).send({
    success: true,
    user: {
      id: req.user._id,
      username: req.user.username
    }
  })
})

// app.post('/posts', async(req, res)=>{
//     // create a new post to push 
//   const post = req.body;
//   posts.push(post)
//   // console.log(req.body);
//   res.send(posts);
// });

// app.post('/login', async(req, res)=>{
//   // authenticate user
//   const user = {username: 'toru1038', password: 'newpassword'} 
//   if(req.body.username == "toru1038" && req.body.password == "password") {
//   const accessToken =  jwt.sign(user, process.env.TOKEN_SECRET);
//   res.send({accessToken:accessToken});
//   }
// });

app.use('/users', userRouter);

// middleware to authenticate token
// function authenticateToken(req, res, next){
//   const authHeader = req.headers['authorization']
//   const token = authHeader && authHeader.split(' ')[1]
//   if (token == null){
//     res.send('no access')
//   }
//   jwt.verify(token, process.env.TOKEN_SECRET, (err, user)=>{
//     if(err){
//       return res.sendStatus(404);
//     }
//     req.user = user 
//     next();
//   });
//   // Bearer TOKEN
// };

app.listen(port, ()=>{
    console.log(`app is listening on port ${port}`);
});