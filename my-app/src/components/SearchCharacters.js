import React from 'react';

const SearchShows = (props) => {
	const handleChange = (e) => {
		props.searchValue(e.target.value);
	};

	return (
		<form
			method='POST '
			onSubmit={(e) => {
				e.preventDefault();
			}}
			name='formName'
			className='center'
		>
			<label>
				<span>Search Character: </span>
				<input autoComplete='off' type='text' name='searchTerm' onChange={handleChange} />
			</label>
			<br/>
			<br/>
		</form>
	);
};

export default SearchShows;
