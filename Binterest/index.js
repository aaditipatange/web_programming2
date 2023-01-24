const {ApolloServer, gql} = require('apollo-server');
const axios = require('axios');
const uuid = require('uuid'); 
const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();
const key = 'NbUwMDv0j48Ta3dS7nUBoTj7UeL5PK-xBs0MkQZllh8';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client.on("error", function (e) {
  console.error("Cannot connect to Redis", e);
  process.exit();
});

const typeDefs = gql`
  type Query {
    unsplashImages(pageNum: Int): [ImagePost]
    binnedImages: [ImagePost]
    userPostedImages: [ImagePost]
    getTopTenBinnedPosts: [ImagePost]
  }

  type ImagePost {
    id: ID!
    url: String!
    posterName: String!
    description: String
    userPosted: Boolean!
    binned: Boolean!
    numBinned: Int!
}

  type Mutation {
    uploadImage(url: String!, description: String, posterName: String): ImagePost
    updateImage(id: ID!, url: String, posterName: String, description: String, userPosted: Boolean, binned: Boolean, numBinned: Int!): ImagePost
    deleteImage(id: ID!): ImagePost
  }
`;

const resolvers = {
  Query: {
    unsplashImages: async (_,args)=>{
      try{
        const res = await axios.get(`https://api.unsplash.com/photos?page=${args.pageNum}&client_id=${key}`);
        const unsplashList=[];
        for(i=0;i<res.data.length;i++){
          let bin = false;
          let binVal = await client.getAsync(res.data[i].id)
          if(binVal!= null){
            binVal = JSON.parse(binVal);
            bin = binVal.binned; 
          }
            let img = {
                id:res.data[i].id,
                url:res.data[i].urls.regular,
                posterName:res.data[i].user.username,
                description:res.data[i].description,
                userPosted:false,
                binned: bin,
                numBinned: res.data[i].likes
            };
            unsplashList.push(img);
        }
        return unsplashList;
      }catch(e){
        return e.message;
      }
    },
    binnedImages: async ()=>{
      try{
       const binned =  (await client.lrangeAsync('BinnedPostList',0,-1)).map(JSON.parse)||[];
       console.log(binned) 
       return binned;
      }catch(e){
        return e.message;
      }
    },
    userPostedImages: async()=>{
      try{
        const userImg =  (await client.lrangeAsync('UserPostedList',0,-1)).map(JSON.parse)||[];
        console.log(userImg) 
        return userImg;
      }catch(e){
        return e.message;
      }
    },
    getTopTenBinnedPosts: async()=>{
      try{
      const popularImg =  (await client.zrevrangebyscoreAsync('SortedBin','+inf','-inf')).map(JSON.parse)||[];
      console.log(popularImg) 
      return popularImg;
      }catch(e){
        return e.message;
      }
    }
  },

  Mutation: {
    uploadImage: async (_, args) => {
      try{
      if(!(args.url) || !(typeof args.url === 'string')){
       throw Error("URL is Required");
      }
      const newPost = {
        id: uuid.v4(),
        url: args.url,
        posterName: args.posterName,
        description: args.description,
        userPosted: true,
        binned: false,
        numBinned: 0
      };
      
      await client.setAsync(newPost.id,JSON.stringify(newPost));
      await client.lpushAsync('UserPostedList',JSON.stringify(newPost));
      return newPost;
    }catch(err){
      return err.message;
    }
    },

    deleteImage: async (_, args) => {
          let delPost = await client.getAsync(args.id);
          let newDelPost = JSON.parse(delPost);
          try{
          await client.lremAsync('UserPostedList',1,delPost);
          await client.lremAsync('BinnedPostList',1,delPost);
          await client.zremAsync('SortedBin',delPost)
          await client.delAsync(args.id);
          return newDelPost;
          }catch(e){
            return e.message;
          }
    },

    updateImage: async (_, args) => {
      const binnedPost = {
        id: args.id,
        url: args.url,
        posterName: args.posterName,
        description: args.description,
        userPosted: args.userPosted,
        binned: args.binned,
        numBinned: args.numBinned
      };
      const updateUserPost = {
        id: args.id,
        url: args.url,
        posterName: args.posterName,
        description: args.description,
        userPosted: args.userPosted,
        binned: !(args.binned),
        numBinned: args.numBinned
      };

      await client.delAsync(args.id);
      await client.setAsync(args.id,JSON.stringify(binnedPost));
      try{
      if(args.userPosted){
        await client.lremAsync('UserPostedList',1,JSON.stringify(updateUserPost));
        await client.lpushAsync('UserPostedList',JSON.stringify(binnedPost));
      }
      
      if(args.binned){
          await client.lpushAsync('BinnedPostList',JSON.stringify(binnedPost));
          await client.zaddAsync('SortedBin',args.numBinned,JSON.stringify(binnedPost))
          return binnedPost;
      }
      else{
        await client.lremAsync('BinnedPostList',1,JSON.stringify(updateUserPost));
        await client.zremAsync('SortedBin',JSON.stringify(updateUserPost))
        return updateUserPost;
      }
    }catch(e){
      return e.message;
    }
    }
  }
};

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});
