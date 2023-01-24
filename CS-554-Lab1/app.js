const express = require('express');
const app = express();
const session = require('express-session');
const configRoutes = require('./routes');
const data = require('./data');
const blogData = data.blogs;
const commData = data.comments;

app.use(express.json());

app.use(
  session({
    name: 'AwesomeWebApp',
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: true,
    resave: false,
  })
);

app.post('/blog',(req,res,next)=>{
  console.log(req.session.user)
  if (!req.session.user) {
    return res.status(403).json({error:'You must Login to post a blog'});
  } else {
    next();
  }
})

app.put('/blog/:id',async (req,res,next)=>{
  console.log(req.session.user)
  if (!req.session.user) {
    return res.status(403).json({error:'You must Login to update a blog (put).'});
  } 
  else {
    try{
    const userValidatedPut = await blogData.userValidation(req.params.id,req.session.user)
    if(userValidatedPut){
      return res.status(403).json({error:'This Blog is created by a Different user. Hence cannot be updated'});
    } 
    else{
      next();
    }}
    catch(e){
      return res.status(403).json({error:e});
    }
  }
})

app.patch('/blog/:id',async (req,res,next)=>{
  console.log(req.session.user)
  if (!req.session.user) {
    return res.status(403).json({error:'You must Login to post a blog (patch).'});
  }
  else {
    try{
    const userValidated =await blogData.userValidation(req.params.id,req.session.user)
  if(userValidated){
    return res.status(403).json({error:'This Blog is created by a Different user. Hence cannot be updated'});
  } 
  else{
    next();
  }
}
catch(e){
  return res.status(403).json({error:e});
}
  }
})

app.post('/blog/:id/comments',(req,res,next)=>{
  console.log(req.session.user)
  if (!req.session.user) {
    return res.status(403).json({error:'You must Login to post a comment.'});
  } else {
    next();
  }
})

app.delete('/blog/:blogId/:commentId',async (req,res,next)=>{
  console.log(req.session.user)
  if (!req.session.user) {
    return res.status(403).json({error:'You must Login to delete a comment'});
  } else {
    try{
    const userValidatedComm = await commData.userValidation(req.params.commentId,req.session.user)
  if(userValidatedComm){
    return res.status(403).json({error:'This comment is posted by a Different user. Hence cannot be deleted'});
  } 
  else{
    next();
  }}
  catch(e){
    return res.status(403).json({error:e});
  }
  }
})

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});