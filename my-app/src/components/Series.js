import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Navigate, useParams } from 'react-router-dom';
import noImage from '../img/download.jpeg';
import { makeStyles, Card, CardContent, CardMedia, Typography, CardHeader } from '@material-ui/core';
import '../App.css';
const useStyles = makeStyles({
	card: {
		maxWidth: 550,
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

const md5 = require('blueimp-md5');
const publickey = '646c22ad868b1200b3d7197c31274da1';
const privatekey = '7b81ba2ba9c789b92452003d492daec9553f4dd4';
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = 'https://gateway.marvel.com:443/v1/public/series';
//const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

const Series = () => {
	const [ seriesData, setSeriesData ] = useState(undefined);
	const [ loading, setLoading ] = useState(true);
	const [ error, setError ] = useState('');
	//const NA='N/A';
	const classes = useStyles();
	let {id} = useParams();
	
	useEffect(
		() => {
			console.log ("useEffect fired")
			async function fetchData() {
				try {
					const { data: series } = await axios.get(baseUrl+'/'+id+'?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash);
					setSeriesData(series);
					setLoading(false);
					console.log(series);
				} catch (e) {
					setError('404 Page not Found');
					setLoading(false);
					console.log(e);
				}
			}
			fetchData();
		},
		[ id ]
	);

	if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	}
	else if(error){
		return (
			<Navigate replace to='/error'/>
			// <div>
			// 	<h2>{error}</h2>
			// </div>
		);
	}
	 else {
		return (

			<Card className={classes.card} variant='outlined'>
				<CardHeader className={classes.titleHead} title={seriesData.data.results[0].title} />
				<CardMedia
								className={classes.media}
								component='img'
								image={seriesData.data.results[0].thumbnail ? `${seriesData.data.results[0].thumbnail.path}/portrait_fantastic.${seriesData.data.results[0].thumbnail.extension}` : noImage}
								title='Series image'
							/>

				<CardContent>
					<Typography variant='body2' color='textSecondary' component='span'>
						<dl>
						<p>
								<dt className='title'>Description:</dt>
								{seriesData && seriesData.data.results[0].description ? <dd>{seriesData.data.results[0].description}</dd> : <dd>N/A</dd>}
							</p>
							<p>
								<dt className='title'>Comics:</dt>
								{seriesData && seriesData.data.results[0].comics.items.length>0 ? (
									<dd>
										{seriesData.data.results[0].comics.items.map((comic)=>{ 
					                     let comicId = comic.resourceURI.split('/')
					                     comicId = comicId[comicId.length-1];
                                         let link = window.location.href.split('series');
					                     link = link[0] +'comics/'+ comicId;
					                     return <a href={link}>{comic.name}<br/></a>})}
									</dd>
								) : (
									<dd>N/A</dd>
								)}
							</p>
							<p>
								<dt className='title'>Characters:</dt>
								{seriesData && seriesData.data.results[0].characters.items.length>0 ? (
									<dd>
										{seriesData.data.results[0].characters.items.map((char)=>{ 
					                     let charId = char.resourceURI.split('/')
					                     charId = charId[charId.length-1];
                                         let link = window.location.href.split('series');
					                     link = link[0] +'characters/'+ charId;
					                     return <a href={link}>{char.name}<br/></a>})}
									</dd>
								) : (
									<dd>N/A</dd>
								)}
							</p>
						</dl>
						<Link to='/series/page/0'>Back to all Series...</Link>
					</Typography>
				</CardContent>
			</Card>
		);
	}
};

export default Series;
