import React from 'react';
import logo from './521-5215473_logo-pokemon-clipart-picture-transparent-pokemon-logo-pokemon.png';
import './App.css';
import IndiPokemon from './components/IndiPokemon';
import Pokemon from './components/Pokemon';
import Home from './components/Home';
import {BrowserRouter as Router, Route, Routes, NavLink} from 'react-router-dom';
import Users from './components/Users';

const App = () => {
  return (
    <div className='App'>
    <Router>
     
        <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>
            PokeDash
          </h1>
          <br/><br/>
          <nav>
          <NavLink className='showlink' to='/'>
            Home
          </NavLink>
          <NavLink className='showlink' to='/pokemon/page/0'>
            Pokemon
          </NavLink>
          <NavLink className='showlink' to='/trainers'>
            Trainers
          </NavLink>
          </nav>
        </header>
        <br />
        <br />
        <div className='App-body'>
          <Routes>
            <Route exact path='/' element={<Home/>} />
            <Route exact path='/trainers' element={<Users/>} />
            <Route exact path='/pokemon/page/:pagenum' element={<Pokemon/>} />
            <Route exact path='/pokemon/:id' element={<IndiPokemon/>} />
            </Routes>
        </div>
    </Router>
    </div>
  );
};

export default App;

