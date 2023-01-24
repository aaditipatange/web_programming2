const axios = require('axios');
const bluebird = require('bluebird');
//const { json } = require('express/lib/response');
const redis = require('redis');
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client.on("error", function (e) {
    console.error("Cannot connect to Redis", e);
    process.exit();
  });


async function getPageList(pagenum){
    let offset = pagenum * 20;
    let pokeList;
    pokeList = await client.getAsync(pagenum);
    if(pokeList){
        pokeList = JSON.parse(pokeList);
    }
    if(pokeList === undefined || pokeList === null){
        const {data} = await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${offset}`)
        await client.setAsync(pagenum,JSON.stringify(data));
        console.log(data);
        pokeList = data;
    } 
    return pokeList;
} 

async function getById(id){
    let poki;
    poki = await client.getAsync('id'+id);
    if(poki){
        poki = JSON.parse(poki);
    }
    if(poki === undefined || poki === null){
        const {data} = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
        await client.setAsync('id'+id,JSON.stringify(data));
        console.log(data);
        poki = data;
    } 
    return poki;
    
}

module.exports = {
    getPageList,
    getById
};
