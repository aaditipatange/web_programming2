import React from 'react';
import logo from './img/tvm-header-logo.png';
import './App.css';
import ShowList from './components/ShowList';
import Show from './components/Show';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const App = () => {
	// const routeChange = () =>{ 
	// 	let path = `/shows/page/:${pagenum-1}`; 
	// 	navigate(path);
	//   }
	return (
		<Router>
			<div className='App'>
				<header className='App-header'>
					<img src={logo} className='App-logo' alt='logo' />
					<h1 className='App-title'>Welcome to the React.js TV Maze API Example</h1>
					<Link className='showlink' to='/'>
						Home
					</Link>
					<Link className='showlink' to='/shows'>
						Shows
					</Link>
					{/* <Link className='showlink' to='/shows/page/:${pagenum-1}'>
						Previous Page
					</Link>
					<Link className='showlink' to="/shows/page/:pagenum+1">
						Next Page
					</Link> */}
				</header>
				<br />
				<br />
				<div className='App-body'>
				    {/* <Button onClick={() => path='/shows/page/:pagenum-1'}>Previous Page</Button> */}
					{/* <Button onClick={routeChange}>Next Page</Button> */}
					{/* <a href={`/shows/page/:${pagenum+1}`}>Previous Page</a>
					<a href={`/shows/page/:${pagenum-1}`}>Next Page</a> */}
					<Route exact path='/' component={Home} />
					<Route exact path='/shows' component={ShowList} />
					<Route exact path='/shows/:id' component={Show} />
					<Route exact path='/shows/page/:pagenum' component={ShowList} />
				
				</div>
			</div>
		</Router>
	);
};

export default App;
