const mongoCollections = require('../config/mongoCollections');
const blogs = mongoCollections.blogs;
const blogFunc = require('./blogs');
let { ObjectId } = require('mongodb');

module.exports = {
async create(blogId, comment, user){
      if (!blogId||!comment) {
        throw 'One or more Input parameter missing. Please provide valid input for all fields of Blog Comment.';
      }
      if (typeof blogId !== 'string' || blogId.trim().length === 0){
        throw 'Please enter Valid (String) Blog ID.'; 
      }
      if (typeof comment !== 'string' || comment.trim().length === 0){
        throw 'Please enter Valid (String) Comment.'; 
      }

    let objParseID = ObjectId(blogId);
    const blog = await blogFunc.get(blogId);
    if(!blog) throw 'Blog does not exist.'
    let newComm = {
        _id: new ObjectId(),
        userThatPostedComment:user,
        comment: comment
      }; 
      blog.comments.push(newComm);
      const commentUpdated = {
      comments: blog.comments
      };
      
      const collectionOfBlogs = await blogs();
      const commentInserted = await collectionOfBlogs.updateOne(
        { _id: objParseID },
        { $set: commentUpdated }
      );
      if (commentInserted.modifiedCount === 0) {
        throw 'Comment could not be added';
      }
      const getBlog = await blogFunc.get(blogId);
    if(!getBlog) throw 'Blog does not exist';
    getBlog.comments.forEach(comm => {
      let getIndex = comm._id.toString();
      comm._id = getIndex;
    });

    return getBlog;
},

async userValidation(id,user){
  const blogCollection = await blogs();
  let objParseID = ObjectId(id);
  const deleteBlogComm = await blogCollection.findOne({ 'comments._id': objParseID });
  if (!deleteBlogComm) {
    throw `Could not find comment with ID ${id}`;
  }
  let returnVal = false
    let commentArray = deleteBlogComm.comments
    commentArray.forEach(element => {
      if(element._id.toString() === id){
      if(element.userThatPostedComment.username!==user.username) {
        returnVal = true;
      }
      }
    });
  return returnVal;
},

async remove(blogID,commentID,user){
    if (!commentID||!blogID) {
        throw 'Comment ID and Blog ID are required input field.';
      }
      if (typeof commentID !== 'string' || commentID.trim().length === 0){
        throw 'Please enter Valid (String) Comment ID'; 
      }
      if (typeof blogID !== 'string' || blogID.trim().length === 0){
        throw 'Please enter Valid (String) Comment ID'; 
      }
    const blogCollection = await blogs();
    let objParseID = ObjectId(commentID);
    const deleteBlogComm = await blogCollection.findOne({ 'comments._id': objParseID });
    if (!deleteBlogComm) {
      throw `Could not delete comment with ID ${commentID}`;
    }
    //const commDetails = 
    await blogCollection.updateOne({ _id: deleteBlogComm._id }, { $pull: { comments: { _id: objParseID } } })
    let retObj ={};
    retObj['commentID']= commentID,
    retObj['deleted']= true
    return retObj;   
}
};