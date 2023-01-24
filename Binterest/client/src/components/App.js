import React from 'react';
import './App.css';
import {ApolloClient, HttpLink, InMemoryCache, ApolloProvider} from '@apollo/client';
import {NavLink, BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './Home';
import NewPost from './NewPost';
//import Error from './Error';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri:'http://localhost:4000/'
  })
});

function App() {
  return (
    <ApolloProvider client={client}>
    <div className="App">
    <Router>
        <div>
          <header className='App-header'>
            <h1 className='App-title'>
             Binterest
            </h1>
            <nav>
            <NavLink className='navlink' to='/my-bin'>
                My Bin
              </NavLink>
              <NavLink className='navlink' to='/'>
                Images 
              </NavLink>
              <NavLink className='navlink' to='/my-posts'>
                My Posts
              </NavLink>
              <NavLink className='navlink' to='/popularity'>
                Popular
              </NavLink>
            </nav>
          </header>
          <Route exact path='/' component={()=><Home page={'/'}/> } />
          <Route exact path='/my-bin' component={()=><Home page={'/my-bin'}/>} />
          <Route exact path='/my-posts' component={()=><Home page={'/my-posts'}/>} />
          <Route exact path='/new-post' component={NewPost} />
          <Route exact path='/popularity' component={()=><Home page={'/popularity'}/>} />
          {/* <Route path='/*' component={Error} /> */}
        </div>
      </Router>
    </div>
    </ApolloProvider>
  );
}

export default App;
