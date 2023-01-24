import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SearchShows from './SearchShows';
import noImage from '../img/download.jpeg';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles } from '@material-ui/core';

import '../App.css';
const useStyles = makeStyles({
	card: {
		maxWidth: 250,
		height: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		borderRadius: 5,
		border: '1px solid #1e8678',
		boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
	},
	titleHead: {
		borderBottom: '1px solid #1e8678',
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
		color: '#1e8678',
		fontWeight: 'bold',
		fontSize: 12
	}
});
const ShowList = (props) => {
	const regex = /(<([^>]+)>)/gi;
	const pagenum = Number(props.match.params.pagenum);
	const classes = useStyles();
	const [ loading, setLoading ] = useState(true);
	const [ searchData, setSearchData ] = useState(undefined);
	const [ showsData, setShowsData ] = useState(undefined);
	const [ searchTerm, setSearchTerm ] = useState('');
	const [ error, setError ] = useState('');
	const [ next, setNext ]= useState(false);
	let card = null;
 
	function prevPage(){
	//  console.log('Inside prevPage')
	//  console.log(pagenum);
	 window.location.href=`/shows/page/${pagenum-1}`;
	}

	function nextPage(){
	//  console.log('Inside nextPage')
	//  console.log(pagenum);
	 if(isNaN(pagenum)){
		window.location.href=`/shows/page/1`; 
	 }
	 else{
	 window.location.href=`/shows/page/${pagenum+1}`;
	 }
	}
	
	// async function disableNext(){
	// 	//let next;
	// 	try{
	// 	const value = await axios.get(`http://api.tvmaze.com/shows?page=${pagenum+2}`); 
	// 	if(value) setNext(false)
	// 	console.log(value);
	// 	}
	// 	catch {
	// 		setNext(true);
	// 		console.log(next);
	// 	}
		
	// 	// try {
	// 	// await axios.get(`http://api.tvmaze.com/shows?page=${pagenum+1}`);
	// 	// } catch (error) {
	// 	// 	setNext(true);
	// 	// 	next = true
	// 	// }
	// 	// console.log(value);
	// 	// if(!value) setNext(true)
	// 	// console.log(next);
	// 	window.location.href=`/shows/page/${pagenum+1}`;
	// 	//else next = true;
	// 	//return next;
	// }
	useEffect(
		() => {
			console.log('pagination useEffect fired');
			debugger
			async function fetchData() {
				try{
					if(pagenum>240){
						await axios.get(`http://api.tvmaze.com/shows?page=${pagenum+1}`); 
					}
				}
				catch(error){
					if(error.response.status===404){
                     setNext(true)
					}
				}
				try {
					console.log(`in fetch pagenum: ${pagenum}`);
					const { data } = await axios.get(`http://api.tvmaze.com/shows?page=${pagenum}`);
					setShowsData(data);
					console.log(data);
					setLoading(false);
				} catch (error) {	
					console.log(error);
					setLoading(false);
					setError(error.message);
				}
			}
			if(pagenum){
				console.log('Page requested')
				fetchData();
		}	
		},
		[ pagenum ]
	);
	useEffect(() => {
		console.log('on load useeffect');
		async function fetchData() {
			debugger
			try {
				const { data } = await axios.get('http://api.tvmaze.com/shows');
				setShowsData(data);
				setLoading(false);
			} catch (e) {
				console.log(e);
			}
		}
		if(!pagenum){
		fetchData();
		}
	}, [pagenum]);

	useEffect(
		() => {
			console.log('search useEffect fired');
			async function fetchData() {
				try {
					console.log(`in fetch searchTerm: ${searchTerm}`);
					const { data } = await axios.get('http://api.tvmaze.com/search/shows?q=' + searchTerm);
					setSearchData(data);
					setLoading(false);
				} catch (e) {
					console.log(e);
				}
			}
			if (searchTerm) {
				console.log ('searchTerm is set')
				fetchData();
			}
		},
		[ searchTerm ]
	);

	// useEffect(
	// 	() => {
	// 		console.log('pagination useEffect fired');
	// 		debugger
	// 		async function fetchData() {
	// 			try{
	// 				if(pagenum>240){
	// 					await axios.get(`http://api.tvmaze.com/shows?page=${pagenum+1}`); 
	// 				}
	// 			}
	// 			catch(error){
	// 				if(error.status===404){
    //                  setNext(true)
	// 				}
	// 			}
	// 			try {
	// 				console.log(`in fetch pagenum: ${pagenum}`);
	// 				const { data } = await axios.get(`http://api.tvmaze.com/shows?page=${pagenum}`);
	// 				setShowsData(data);
	// 				console.log(data);
	// 				setLoading(false);
	// 			} catch (error) {	
	// 				console.log(error);
	// 				setError(error.message);
	// 			}
	// 		}
	// 		if(pagenum){
	// 			console.log('Page requested')
	// 			fetchData();
	// 	}	
	// 	},
	// 	[ pagenum ]
	// );



	const searchValue = async (value) => {
		setSearchTerm(value);
	};
	const buildCard = (show) => {
		return (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={show.id}>
				<Card className={classes.card} variant='outlined'>
					<CardActionArea>
						<Link to={`/shows/${show.id}`}>
							<CardMedia
								className={classes.media}
								component='img'
								image={show.image && show.image.original ? show.image.original : noImage}
								title='show image'
							/>

							<CardContent>
								<Typography className={classes.titleHead} gutterBottom variant='h6' component='h3'>
									{show.name}
								</Typography>
								<Typography variant='body2' color='textSecondary' component='p'>
									{show.summary ? show.summary.replace(regex, '').substring(0, 139) + '...' : 'No Summary'}
									<span>More Info</span>
								</Typography>
							</CardContent>
						</Link>
					</CardActionArea>
				</Card>
			</Grid>
		);
	};

	if (pagenum){
		console.log("Inside Pagination")
		card =
			showsData &&
			showsData.map((show) => {
				return buildCard(show);
			});
	 } 
	if (searchTerm) {
		card =
			searchData &&
			searchData.map((shows) => {
				let { show } = shows;
				return buildCard(show);
			});
	} else {
		card =
			showsData &&
			showsData.map((show) => {
				return buildCard(show);
			});
	}

	if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	}else if(error){
		return (
			<div>
				<h2>{error}</h2>
			</div>
		);
	} 
	// else if(pagenum){
	// 	return (
	// 		<div>
	// 			<button disabled={pagenum>0?false:true} onClick={prevPage}>Previous Page</button>
	// 			&nbsp;&nbsp;
	// 			<button disabled={pagenum>=243?true:false} onClick={nextPage}>Next Page</button>
	// 			<br />
	// 			<br />
	// 			<Grid container className={classes.grid} spacing={5}>
	// 				{card}
	// 			</Grid>
	// 		</div>
	// 	);
	// }
	else {
		return (
			<div>
				<button disabled={pagenum>0?false:true} onClick={prevPage}>Previous Page</button>
				&nbsp;&nbsp;
				<button disabled={next} onClick={nextPage}>Next Page</button>
				<br />
				<br />
				<SearchShows searchValue={searchValue} />
				<Grid container className={classes.grid} spacing={5}>
					{card}
				</Grid>
			</div>
		);
	}
};

export default ShowList;
