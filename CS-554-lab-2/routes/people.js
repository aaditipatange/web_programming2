const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();
const express = require('express');
const router = express.Router();
const peopleData = require('../data');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get('/history', async (req,res)=>{
  try{
  const recentlyViewed = (await client.lrangeAsync('recentlyViewedPeopleList',0,19)).map(JSON.parse);
  //console.log(recentlyViewed);
  res.status(200).json(recentlyViewed);
  }catch(e){
    res.status(400).json('Something Went Wrong!!');
  }
})

router.get('/:id', async (req, res) => {
  let cachedPeople = (await client.lrangeAsync('cachedPeopleList', 0 , -1)).map(JSON.parse);
  if(cachedPeople.length > 0){
    let retObj;
    cachedPeople.forEach(ele => {
      if(ele.id == req.params.id){
        retObj = ele;
      }
    });
    if(retObj){
    await client.lpushAsync('recentlyViewedPeopleList', JSON.stringify(retObj));
    return res.status(200).json(retObj);
    }
  }
  try {
    const person = await peopleData.getById(req.params.id);
    await client.lpushAsync('cachedPeopleList', JSON.stringify(person));
    await client.lpushAsync('recentlyViewedPeopleList', JSON.stringify(person));
    res.status(200).json(person);
  } catch (e) {
    res.status(404).json({error : "Error Occured!!"});
  }
});


module.exports = router;