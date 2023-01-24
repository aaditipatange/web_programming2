import {v4 as uuid} from 'uuid';

const initalState = {
    currentTrainerId: null,
    Trainers:[
        {
            id: uuid(),
            name: 'Ash Ketchum',
            Caughtpokemons: []
          }
    ],
  maxTeamError:false,
  trainerMissingError:false
};

let copyState = null;
let copy = null;
let index = 0;

const userReducer = (state = initalState, action) => {
  const {type, payload} = action;

  switch (type) {
    case 'CREATE_USER':
    
      return {
        ...state, 
        Trainers:[
            ...state.Trainers,
            {id: uuid(), name: payload.name,Caughtpokemons: [] },
        ],
      };
      
    case 'SELECT_USER':
          return {currentTrainerId: payload.id, Trainers:[...state.Trainers]};

    case 'DELETE_USER':
      copyState = [...state.Trainers];
      index = copyState.findIndex((x) => x.id === payload.id);
      copyState.splice(index, 1);
      return {...state,Trainers:[...copyState]};

    case 'CATCH_POKEMON':
        copyState = {...state};

        if(copyState.currentTrainerId===null){
            return{...state,trainerMissingError:true}
        }else{
            copy = state.Trainers
            index =  copy.findIndex((x)=>x.id===copyState.currentTrainerId);
            if(copy[index].Caughtpokemons.length>=6){
                return{...state,maxTeamError:true}
            }else{
                copy[index].Caughtpokemons.push(payload.pokedata)
                return{...state, Trainers:[...copy], maxTeamError: false, trainerMissingError:false}
            }
        }

        case 'RELEASE_POKEMON':
        
        copyState={...state};

        if(copyState.currentTrainerId==null){
            return{...state, trainerMissingError:true}
        }else{
            copy = state.Trainers
            index = copy.findIndex((x)=>x.id===copyState.currentTrainerId);
            let catched = []
            let i ;
            catched = copy[index].Caughtpokemons;
            i = catched.findIndex((x) => x.name === payload.pokedata.name);
            console.log("index", i)
            copy[index].Caughtpokemons.splice(i,1)
            console.log("copy",copy)
            console.log("this is the state",
          {...state,
            Trainers: [...copy],
            trainerMissingError: false,
          maxTeamError: false}
         )
          return{...state,
            Trainers: [...copy],
            trainerMissingError: false,
            maxTeamError: false}
        }
 

    default:
      return state;
  }
};

export default userReducer;