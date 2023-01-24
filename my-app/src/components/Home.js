import React from 'react';
import '../App.css';

const Home = () => {
	return (
		<div>
			<p className='hometext'>
			Marvel Studios is an entertainment brand defined the stories and successes of our more than 8,000 
			incredible characters like Iron Man, Thor, Black Panther and Captain America. 
			Based at the Walt Disney Studios in Burbank, California, Marvel Studios is one of the most successful 
			movie studios in the world, today. The Marvel Cinematic Universe multi-film franchises, 
			led by President Kevin Feige, is a universe filled with creativity, innovation and collaboration.
			</p>

			{/* <p className='hometext'>
				The application queries two of TV Maze's end-points:{' '}
				<a rel='noopener noreferrer' target='_blank' href='http://api.tvmaze.com/shows'>
					http://api.tvmaze.com/shows
				</a>{' '}
				and{' '}
				<a rel='noopener noreferrer' target='_blank' href='http://api.tvmaze.com/search/shows?q=SEARCH_TERM'>
					http://api.tvmaze.com/search/shows?q=SEARCH_TERM
				</a>{' '}
				for searching the shows in the API (Where SEARCH_TERM is what the user types into the search input)
			</p> */}
		</div>
	);
};

export default Home;
