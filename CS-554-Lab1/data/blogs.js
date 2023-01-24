const mongoCollections = require('../config/mongoCollections');
const blogs = mongoCollections.blogs;
let { ObjectId } = require('mongodb');

module.exports = {
  //Functions Start here

async create(title,body,user)
{
  //Error Handeling
  if (!title||!body) {
    throw 'One or more Input parameter missing. Please provide valid input for the Blog Post.';
  }
  if (typeof title !== 'string' || title.trim().length === 0){
    throw 'Please enter Valid (String) Title for Blog'; 
  }
  if (typeof body !== 'string' || body.trim().length === 0){
    throw 'Please enter Valid (String) body for Blog'; 
  }

  //Insert data into Database
    const collectionOfBlogs = await blogs();

    let blogDetails = {
        title: title,
        body: body,
        userThatPosted: user, //{_id:user._id, username:user.username},
        comments:[]
    };

    const blogInserted = await collectionOfBlogs.insertOne(blogDetails);

    if (blogInserted.insertedCount === 0) {
      throw 'Blog could not be added';
    }
    let blogId = blogInserted.insertedId;
    
    //convert ObjectID to String
    blogId = blogId.toString();

    const blog = await this.get(blogId);
    return blog;
},

async getAll(n,y){
  //Error Handeling
  if(n < 0 || typeof n !== "number") n = 0;
  if(y < 0 || typeof y !== "number") y = 20;
  if(y > 100) y = 100;

  //Get list of data in DB
  const collectionOfBlogs = await blogs();
  const listOfAllBlogs = await collectionOfBlogs.find({}).skip(n).limit(y).toArray();
    //convert ObjectID to String
    listOfAllBlogs.forEach(blog => {
      let getIndex = blog._id.toString();
      blog._id = getIndex;
    });
    return listOfAllBlogs;
},

async get(id){
 //Error Handeling
    if (!id) {
      throw 'Input Id field is required.';
    }
    
    if(typeof id !=='string'||id.trim().length===0){
      throw 'Id can only be of type String.';
    }

    //Converting String ID to ObjectID
    let objParseID = ObjectId(id);

    const collectionOfBlogs = await blogs();
    const blog = await collectionOfBlogs.findOne({ _id: objParseID });
    if (!blog) {
      // let getIndex = blog._id.toString();
      // blog._id = getIndex;
      throw 'Blog could not be found with the supplied ID.';
      //return  'Blog could not be found with the supplied ID.';
    }
    let getIndex = blog._id.toString();
    blog._id = getIndex;
    console.log(blog);
    return blog;
},

async userValidation(id,user){
  const fieldValOfBlog = await this.get(id);
  if(!fieldValOfBlog|| fieldValOfBlog === undefined|| fieldValOfBlog===""||fieldValOfBlog===null) throw 'Blog does not exist.';
  if(fieldValOfBlog.userThatPosted.username!==user.username) {return true}
  else{
    return false}
  
},

async update (id, updatedBlog, user){
    if (!id||!updatedBlog) {
        throw 'One or more Input parameter missing. Please provide valid input for all fields.';
      }
      if (typeof id !== 'string' || id.trim().length === 0){
        throw 'Please enter Valid (String) ID of Blog'; 
      }

      const fieldValOfBlog = await this.get(id);
      if(!fieldValOfBlog) throw 'Blog does not exist.';
      
      //Update Data
      const updatedBlogData = {};

    if (updatedBlog.title) {
      updatedBlogData.title = updatedBlog.title;
    }
    if (updatedBlog.body) {
      updatedBlogData.body = updatedBlog.body;
    }
    const collectionOfBlogs = await blogs();
    let objParseID = ObjectId(id);
    const blogDataUpdate = await collectionOfBlogs.updateOne(
      { _id: objParseID },
      { $set: updatedBlogData }
    );
    if (blogDataUpdate.modifiedCount === 0) {
      throw 'Blog details could not be updated.';
    }
    return await this.get(id);  
}
};
