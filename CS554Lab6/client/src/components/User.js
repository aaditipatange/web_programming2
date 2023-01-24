import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import actions from '../actions';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography,
    makeStyles,
  } from '@material-ui/core';
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

function User(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  let card = null;
  const allUsers = useSelector((state) => state.users);
  console.log(allUsers);

  const deleteUser = () => {
    dispatch(actions.deleteUser(props.user.id));
  };

  const selectUser = ()=>{
    dispatch(actions.selectUser(props.user.id));
  };

  const buildCard = (pokimon) => {
    let id;
    if(pokimon.id){
        id = pokimon.id;
    }
    else{
    id = pokimon.url;
    id = id.split('/');
    id = id[id.length-2]
}
    //console.log(id);
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
    </Grid>
  );
};

card =
props.user &&
props.user.Caughtpokemons.map((pokimon) => {
        return buildCard(pokimon);
      });

  return (
    <div className='todo-wrapper'>
      <table>
        <tbody>
          <tr>
            <td>Name:</td>
            <td>{props.user.name}</td>
          </tr>
          <tr>
            <td>
              <button onClick={selectUser}>{props.user.id === allUsers?.currentTrainerId?'Selected':'Select Trainer'}</button>
            </td>
            <td>
                {props.user.id === allUsers?.currentTrainerId?'':<button disabled={props.user.id === allUsers.currentTrainerId?true:false} onClick={deleteUser}>Delete User</button>}
            </td>
          </tr>
        </tbody>
      </table>
      <Grid container className={classes.grid} spacing={3}>
          {card}
        </Grid>
    </div>
  );
}

export default User;