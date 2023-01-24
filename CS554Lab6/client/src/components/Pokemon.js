import React, {useState, useEffect} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {useDispatch,useSelector} from 'react-redux';
import actions from '../actions';
//import SearchShows from './SearchShows';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  makeStyles,
  Button
} from '@material-ui/core';

import '../App.css';

const useStyles = makeStyles({
  card: {
    maxWidth: 250,
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
const Pokemon = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  //const [searchData, setSearchData] = useState(undefined);
  const [pokeData, setPokeData] = useState(undefined);
  //const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let {pagenum} = useParams();
  let card = null;

  let myTrainer = useSelector((state) => state.users)
  console.log('Trainers',myTrainer)

function handleCatch(pokimon){
    console.log('Inside: ',myTrainer)
    if(myTrainer){
    for(let j = 0; j<myTrainer.Trainers.length; j++)
    {
        if(myTrainer.currentTrainerId===myTrainer.Trainers[j].id){
            for(let i=0;i<myTrainer.Trainers[j].Caughtpokemons.length;i++)
            {   
                if(parseInt(myTrainer.Trainers[j].Caughtpokemons[i].id)===parseInt(pokimon.id))
                return true
            }
        }
       
}
    return false
    }
}

  useEffect(() => {
    console.log('on load useeffect');
    async function fetchData() {
      try {
        await fetch(`http://localhost:4000/pokemon/page/${pagenum}`)
        .then(res=>res.json())
        .then(data=>setPokeData(data))
        setLoading(false);
        if(pagenum>56){
            setError(true);
        }
      } catch (e) {
        console.log(e);
        setError(true)
      }
    } 
    fetchData();
  }, [pagenum]);

//   useEffect(() => {
//     console.log('search useEffect fired');
//     async function fetchData() {
//       try {
//         console.log(`in fetch searchTerm: ${searchTerm}`);
//         const {data} = await axios.get(
//           'http://api.tvmaze.com/search/shows?q=' + searchTerm
//         );
//         //setSearchData(data);
//         setLoading(false);
//       } catch (e) {
//         console.log(e);
//       }
//     }
//     if (searchTerm) {
//       console.log('searchTerm is set');
//       fetchData();
//     }
//   }, [searchTerm]);

//   const searchValue = async (value) => {
//     setSearchTerm(value);
//   };

  const buildCard = (pokimon) => {
      let id = pokimon.url;
      id = id.split('/');
      id = id[id.length-2]
      pokimon['id']= id;
      //console.log(id);
      let caughtData =  handleCatch(pokimon);
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={id}>
        <Card className={classes.card} variant='outlined'>
          <CardActionArea>
            <Link to={`/pokemon/${id}`}>
              <CardMedia
                className={classes.media}
                component='img'
                image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                title='Pokemon image'
              />
              <CardContent>
                <Typography
                  className={classes.titleHead}
                  gutterBottom
                  variant='h6'
                  component='h2'
                >
                  {pokimon.name}
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
        { caughtData===true?<Button onClick={()=> dispatch(actions.pokeRelease(pokimon))}>RELEASE</Button>:<Button onClick={()=> dispatch(actions.pokeCatch(pokimon))}>CATCH</Button>}
      </Grid>
    );
  };

//   if (searchTerm) {
//     card =
//       searchData &&
//       searchData.map((pokimons) => {
//         let {pokimon} = pokimons;
//         return buildCard(pokimon);
//       });
//   } else {
    card =
      pokeData &&
      pokeData.results.map((pokimon) => {
        return buildCard(pokimon);
      });
  //}

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
    return (
      <div>
          {pokeData.previous===null?'':<Button classes={{ disabled: classes.disabledButton }} disabled={pokeData.previous===null} onClick={() => navigate(`/pokemon/page/${parseInt(pagenum)-1}`)} > Previous Page</Button>}
 		  &nbsp;&nbsp;
         {pokeData.next===null?'': <Button classes={{ disabled: classes.disabledButton }} disabled={pokeData.next===null} onClick={() => navigate(`/pokemon/page/${parseInt(pagenum)+1}`)}>Next Page</Button>}<br/><br/>
        {/* <SearchShows searchValue={searchValue} /> */}
        <br />
        <br />
        <Grid container className={classes.grid} spacing={5}>
          {card}
        </Grid>
      </div>
    );
  }
};

export default Pokemon;
