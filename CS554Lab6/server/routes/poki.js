const express = require('express');
const data  = require('../data');
const router = express.Router();

router.get('/page/:pagenum', async (req,res)=>{
    try {
        const pokeList = await data.pokemon.getPageList(req.params.pagenum)
        res.json(pokeList);
      } catch (e) {
        res.status(400).json({e});
      }
    
})

router.get('/:id', async (req,res)=>{
    try{
    const poke = await data.pokemon.getById(req.params.id);
    res.json(poke);
    } catch(e){
        res.status(400).json('Error Occured');
    }
})

module.exports = router;