import React, {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import actions from '../actions';
import {
  makeStyles,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardHeader,
  Button
} from '@material-ui/core';
import '../App.css';
const useStyles = makeStyles({
  card: {
    maxWidth: 550,
    height: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 5,
    border: '1px solid #a11a1a',
    boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
  },
  titleHead: {
    borderBottom: '1px solid #a11a1a',
    fontWeight: 'bold'
  },
  grid: {
    flexGrow: 1,
    flexDirection: 'row'
  },
  media: {
    height: '100%',
    width: '100%'
  },
  button: {
    color: '#a11a1a',
    fontWeight: 'bold',
    fontSize: 12
  },
  disabledButton: {
    color: '#767676 !important',
  }
});

const IndiPokemon = () => {
  const [pokeData, setPokeData] = useState(undefined);
  //const [catchRelease, setCatRelease] = useState('Catch');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const classes = useStyles();
  let {id} = useParams();

  function status(res) {
    if (!res.ok) {
        setError(true);
    }
    return res;
}

 let myTrainer = useSelector((state) => state.users)
 console.log('Trainers',myTrainer)

function handleCatch(pokeData){
    console.log('Inside: ',myTrainer)
    if(myTrainer){
    for(let j = 0; j<myTrainer.Trainers.length; j++)
    {
        if(myTrainer.currentTrainerId===myTrainer.Trainers[j].id){
            for(let i=0;i<myTrainer.Trainers[j].Caughtpokemons.length;i++)
            {   
                if(parseInt(myTrainer.Trainers[j].Caughtpokemons[i].id)===parseInt(pokeData.id))
                return true
            }
        }
       
}
    return false
    }
}

  useEffect(() => {
    console.log('useEffect fired');
    async function fetchData() {
        try {
            await fetch(`http://localhost:4000/pokemon/${id}`)
            .then(status)
            .then(res=>res.json())
            .then(data=>setPokeData(data))
            setLoading(false);
          } catch (e) {
            console.log(e);
            setError(true);
          }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else if (error) {
    return (
        <div>
          <h2>404 Error Occured.... Cannot load this page</h2>
        </div>
      );
  } else {
    let caughtData =  handleCatch(pokeData);
    return (
      <Card className={classes.card} variant='outlined'>
        <CardHeader className={classes.titleHead} title={pokeData.name} />
        <CardMedia
                className={classes.media}
                component='img'
                image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                title='Pokemon image'
              />

        <CardContent>
          <Typography variant='body2' color='textSecondary' component='span'>
              <dl>
              <p>
                <dt className='title'>Types:</dt>
                {pokeData &&
                pokeData.types.length>=1 ? (
                  <span>
                    {pokeData.types.map((type) => {
                        return <dd key={type.type.name}>{type.type.name},</dd>;
                     })}
                  </span>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              </dl>
          { caughtData===true?<Button onClick={()=> dispatch(actions.pokeRelease(pokeData))}>RELEASE</Button>:<Button onClick={()=> dispatch(actions.pokeCatch(pokeData))}>CATCH</Button>}
              <br/>
              <br/>
            <Link to='/pokemon/page/0'>Back to all Pokemon...</Link>
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default IndiPokemon;
