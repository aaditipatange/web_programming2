import React from 'react';
import './App.css';
import {useMutation} from '@apollo/client';
import queries from '../queries';
import { Button } from '@material-ui/core';

function NewPost() {
    const [addImage] = useMutation(queries.ADD_IMAGE);
    let imageUrl;
    let posterName;
    let description;
    return (
        <form
        className='form'
        id='add-image'
        onSubmit={(e) => {
          console.log(imageUrl.value);
          console.log(posterName.value);
          console.log(description.value);
          e.preventDefault();
         try{
           if(!imageUrl.value){
             throw Error('URL is Required');
           }
          addImage({
            variables: {
              url: imageUrl.value,
              posterName: posterName.value,
              description: description.value
            }
          });
          imageUrl.value = '';
          posterName.value = '';
          description.value = '';
          window.location.pathname = '/my-posts';
        }catch(err){
          alert(err.message);
        }
        }}
      >
          <h2>Create a Post</h2>
        <div className='form-group'>
          <label>
            Image URL:
            <br />
            <input required
              ref={(node) => {
                imageUrl = node;
              }}
              autoFocus={true}
            />
          </label>
        </div>
        <br />
        <div className='form-group'>
          <label>
            Poster Name:
            <br />
            <input 
              ref={(node) => {
                posterName = node;
              }}
            />
          </label>
        </div>
        <br />

        <div className='form-group'>
          <label>
            Description:
            <br />
            <input 
            ref={(node) => {
                description = node;
              }}
            />
          </label>
        </div>
        <br />
        <br />
        <Button variant='outlined'  type='submit'>Submit</Button>
      </form>
    );
  }
  
  export default NewPost;