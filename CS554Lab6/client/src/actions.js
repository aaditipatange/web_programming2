const addUser = (name) => ({
	type: 'CREATE_USER',
	payload: {
		name: name,
	},
});

const selectUser = (id) => ({
	type: 'SELECT_USER',
	payload: { id: id },
});

const deleteUser = (id) => ({
	type: 'DELETE_USER',
	payload: { id: id },
});

const pokeCatch = (pokedata) => ({
	type: 'CATCH_POKEMON',
	payload: { pokedata: pokedata },
});

const pokeRelease = (pokedata) => ({
	type: 'RELEASE_POKEMON',
	payload: { pokedata: pokedata },
});

module.exports = {
	addUser,
	deleteUser,
	selectUser,
	pokeCatch,
    pokeRelease
};