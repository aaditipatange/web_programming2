const express = require('express');
const router = express.Router();
const data = require('../data');
const blogData = data.blogs;
const commData = data.comments;
const userData = data.users;

router.get('/logout', async (req, res) => {
  req.session.destroy();
  res.send('Logged out');
});

router.get('/', async (req, res) => {
  try {
    let take,skip;
    if(req.query.take){
     take = parseInt(req.query.take);
    }
    else{
      take = 20;
    }
    if(req.query.skip){
      skip = parseInt(req.query.skip);
     }
     else{
       skip = 0;
     }
    
    if(skip < 0) {
      res.status(400).json({ error: 'Negative values cannot be supplied for skip' });
      return;
    }
    if(take < 0) {
      res.status(400).json({ error: 'Negative values cannot be supplied for take' });
      return;
    }
  if (isNaN(take)||isNaN(skip)){
    res.status(400).json({ error: 'Please enter valid values for take/skip' });
      return;
  }
    const listBlog = await blogData.getAll(skip,take);
    res.status(200).json(listBlog);
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.get('/:id', async (req, res) => {
  try {
    const blog = await blogData.get(req.params.id);
    res.status(200).json(blog);
  } catch (e) {
    res.status(404).json({error : e});//'Blog not found.'});
  }
});

router.post('/', async (req, res) => {
    const blogDataList = req.body;
    if (!blogDataList.title) {
      res.status(400).json({ error: 'You must provide title of Blog' });
      return;
    }
    if (!blogDataList.body) {
      res.status(400).json({ error: 'You must provide body of Blog' });
      return;
    }
    try {
      const { title, body } = blogDataList;
      console.log(req.session.user)
      if(!req.session.user){
        res.status(400).json({ error: 'You must login to post blog' });
        return;
      }
      const newBlog = await blogData.create(title, body, req.session.user);
      res.status(200).json(newBlog);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });
  
  router.put('/:id', async (req, res) => {
    const updatedData = req.body; 
    if (!updatedData.title || !updatedData.body) {
      res.status(400).json({ error: 'You must Supply Title and Body of the blog' });
      return;
    }
    try {
      await blogData.get(req.params.id);
    } catch (e) {
      res.status(404).json({ error: e });
      return;
    }
    try {
      const updatedBlog = await blogData.update(req.params.id, updatedData, req.session.user);
      res.status(200).json(updatedBlog);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

  router.patch('/:id', async (req, res) => {
    const requestBody = req.body;
    let updatedObject = {};
    try {
      const oldPost = await blogData.get(req.params.id);
      if (requestBody.title && requestBody.title !== oldPost.title)
        updatedObject.title = requestBody.title;
      if (requestBody.body && requestBody.body !== oldPost.body)
        updatedObject.body = requestBody.body;
    } catch (e) {
      res.status(404).json({ error: e});//'Blog not found' });
      return;
    }
    if (Object.keys(updatedObject).length !== 0) {
      try {
        const updatedBlog = await blogData.update( req.params.id, updatedObject, req.session.user);
        res.status(200).json(updatedBlog);
      } catch (e) {
        res.status(500).json({ error: e });
      }
    } else {
      res.status(400).json({error: 'No fields have been changed from their inital values, so no update has occurred'});
    }
  });

  router.post('/:id/comments', async (req, res) => {
    const commBody = req.body;  
    if (!commBody.comment) {
      res.status(400).json({ error: 'Please provide your comment.' });
      return;
    }
      try {
        await blogData.get(req.params.id);
      } catch (e) {
        res.status(400).json({ error: e });
        return;
      }
    try {
      const {comment} = commBody;
      const newComment = await commData.create(req.params.id, comment, req.session.user);
      res.status(200).json(newComment);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });
  
  router.delete('/:blogId/:commentId', async (req, res) => {
    if (!req.params.blogId || !req.params.commentId) {
      res.status(400).json({ error: 'You must Supply blogId and commentId to delete' });
      return;
    }
    try {
      await blogData.get(req.params.blogId);
    } catch (e) {
      res.status(404).json({ error: e });
      return;
    }
    try {
      const delcomment = await commData.remove(req.params.blogId,req.params.commentId,req.session.user);
      res.status(200).json(delcomment);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

  router.post("/signup", async (req, res) => {
    const newUser = req.body;
  
    // Error handling for name
    if (!newUser.name || newUser.name.trim().length === 0) {
      res.status(400).json({ error: 'You must Supply user name' });
      return;
    }
    newUser.name = newUser.name.trim();
    for (let i = 0; i < newUser.name.length; i++) {
      const element = newUser.name[i];
      if (!element.match(/([a-zA-Z])/)) {
        res.status(400).json({ error: "only characters allowed for name" });
        return;
      }
    }
    // Error handling for username
    if (!newUser.username || newUser.username.trim().length === 0) {
      res.status(400).json({ error: "Please provide username" });
      return;
    }
    newUser.username = newUser.username.trim().toLowerCase();
    if (newUser.username.length < 4) {
      res.status(400).json({ error: "username should be at least 4 characters long" });
      return;
    }
    for (let i = 0; i < newUser.username.length; i++) {
      const element = newUser.username[i];
      if (/\s+/g.test(element)) {
        res.status(400).json({ error: "spaces not allowed in username" });
        return;
      }
      if (!element.match(/([a-z0-9])/)) {
        res.status(400).json({ error: "only alphanumeric characters allowed for username" });
        return;
      }
    }
    // Error handling for password
    if (!newUser.password || newUser.password.trim().length === 0) {
      res.status(400).json({ error: "Please provide password" });
      return;
    }
    if (newUser.password.length < 6) {
      res.status(400).json({ error: "password should be at least 6 characters long" });
      return;
    }
    for (let i = 0; i < newUser.password.length; i++) {
      const element = newUser.password[i];
      if (/\s+/g.test(element)) {
        res.status(400).json({ error: "spaces not allowed in password" });
        return;
      }
    }
  
    try {
      const { name, username, password } = newUser;
      const user = await userData.createUser(name, username, password);
      //For Sessions
      res.status(200).json(user);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  });
  
  router.post("/login", async (req, res) => {
    const newUser = req.body;
    // Error handling for username
    if (!newUser.username || newUser.username.trim().length === 0) {
      res.status(400).json({ error: "Please provide username" });
      return;
    }
    newUser.username = newUser.username.trim().toLowerCase();
    if (newUser.username.length < 4) {
      res.status(400).json({ error: "username should be at least 4 characters long" });
      return;
    }
    for (let i = 0; i < newUser.username.length; i++) {
      const element = newUser.username[i];
      if (/\s+/g.test(element)) {
        res.status(400).json({ error: "spaces not allowed in username" });
        return;
      }
      if (!element.match(/([a-z0-9])/)) {
        res.status(400).json({ error: "only alphanumeric characters allowed for username" });
        return;
      }
    }
    // Error handling for password
    if (!newUser.password || newUser.password.trim().length === 0) {
      res.status(400).json({ error: "Please provide password" });
      return;
    }
    if (newUser.password.length < 6) {
      res.status(400).json({ error: "password should be at least 6 characters long" });
      return;
    }
    for (let i = 0; i < newUser.password.length; i++) {
      const element = newUser.password[i];
      if (/\s+/g.test(element)) {
        res.status(400).json({ error: "spaces not allowed in password" });
        return;
      }
    }
  
    try {
      const { username, password } = newUser;
      const rev = await userData.checkUser(username, password);
      if (rev) {
        req.session.user = { _id:rev._id, username: rev.username };
        res.status(200).json(rev);
        console.log(req.session);
      }
    } catch (e) {
      res.status(400).json({ error: e });
    }
  });

module.exports = router;