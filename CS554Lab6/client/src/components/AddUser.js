import React,{useState} from 'react';
import {useDispatch} from 'react-redux';
import actions from '../actions';

function AddUser() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({task: '', taskDesc: ''});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };
  const addUser = () => {
    dispatch(actions.addUser(formData.name));
    document.getElementById('name').value = '';
  };
  console.log(formData);
  return (
    <div className='add'>
      <div className='input-selection'>
        <label>
          Trainer Name:
          <input
            onChange={(e) => handleChange(e)}
            id='name'
            name='name'
            placeholder='Name...'
          />
        </label>
      </div>
      <button onClick={addUser}>Add Trainer</button>
    </div>
  );
}

export default AddUser;