import React, {useState} from 'react';
import './App.css';
import {useMutation, useQuery} from '@apollo/client';
import queries from '../queries';
import {Button} from '@material-ui/core';


function Home(props) {
    const[pageNo,setPageNum] = useState(1);
    let location = props.page;
    const {loading,error,data} = useQuery(queries.GET_UNSPLASHIMAGES,{fetchPolicy:'cache-and-network',variables:{pageNum:pageNo}})
    const {loading:loading_bin,error:error_bin,data:data_bin} = useQuery(queries.GET_BINNEDIMAGES, {fetchPolicy:'cache-and-network'})
    const {loading:user_loading,error:user_error,data:user_data} = useQuery(queries.GET_USERIMAGES,{fetchPolicy:'cache-and-network'}) 
    const {loading:loading_popular,error:error_popular,data:data_popular} = useQuery(queries.GET_POPULAR,{fetchPolicy:'cache-and-network'})
    const [deleteImage]= useMutation(queries.DELETE_IMAGE);
    const [editImage] = useMutation(queries.EDIT_IMAGE);

    //handle event functions
    const handleClick = () => {
        setPageNum(pageNo+1);
      };
        const handleBin = (image) => {
        let imgbin = image.binned?false:true;
        try{
         editImage({variables:{id:image.id,url:image.url,posterName:image.posterName,description:image.description,userPosted:image.userPosted,binned:imgbin,numBinned:image.numBinned}})   
        }catch(e){
            return e.message;
        }
        if(location === '/my-bin'||location==='/my-posts'||location==='/popularity'){
            window.location.reload(); 
        }
      };
      const handleDelete = (image) => {
          try{
        deleteImage({variables:{id:image.id}})
          }catch(e){
              alert(e.message);
          }
          window.location.reload();
      };
    const handleRedirect=()=>{
        window.location.pathname='/new-post' 
    }

     if(location ==='/my-bin'){
         if(data_bin) {
             if(data_bin.binnedImages.length<=0){
                 return(
                     <div>No Binned Images</div>
                 )
             }
             else{
            return(
                <div>
                    <ul>
                    {data_bin.binnedImages.map(image => {
                        let del = false;
                 return(
            buildCard(image,del))
        })
    }
            </ul>
            </div>
            ) 
}
    }
         else if(loading_bin){return <div>Loading...</div>}
         else if(error_bin){return <div>{error_bin.message}</div>}    
    }
    else if(location ==='/my-posts'){
        if(user_data) {
            if(user_data.userPostedImages.length<=0){
                return(
                    <div>
                    <Button id='upload' variant='outlined' type='button' onClick={handleRedirect}>Upload Image</Button>
                    <p>No User Images</p>
                    </div>
                )
            }
            else{
            return(
                <div>
                    <Button id='upload' variant='outlined' type='button' onClick={handleRedirect}>Upload Image</Button>
                    <ul>
                    {user_data.userPostedImages.map(image => {
                        let del = true;
                 return(
            buildCard(image,del))
        })
    }
    </ul>
            </div>
            )
}
}
         else if(user_loading){return <div>Loading...</div>}
         else if(user_error){return <div>{user_error.message}</div>} 
    }
    else if(location==='/popularity'){
        if(data_popular) {
            if(data_popular.getTopTenBinnedPosts.length<=0){
                return(
                    <div>No Images</div>
                )
            }
            else{
            let count = 0;
            return(
                <div>
                    <ul>
                    {data_popular.getTopTenBinnedPosts.slice(0,10).map(image => {
                        let del = false;
                        count += image.numBinned;
                    console.log('likes: '+ count)
                 return(
            buildCard(image,del))
        })
    }
    </ul>
    <p id='stream'>{count>200?'Mainstream':'Non-Mainstream'}</p>
            </div>
            ) 
}
        }
         else if(loading_popular){return <div>Loading...</div>}
         else if(error_popular){return <div>{error_popular.message}</div>} 
}
    else if(location==='/'){
        if(data) {
            return(
                <div>
                    <ul>
                    {data.unsplashImages.map(image => {
                        let del = false;
                 return(
            buildCard(image,del))
        })
    }
    <Button variant='outlined' type='button' onClick={handleClick}>Get More</Button>
    </ul>
            </div>
            ) }
         else if(loading){return <div>Loading...</div>}
         else if(error){return <div>{error.message}</div>} 
}

function buildCard(image,del){
                 return(
                     <div key={image.id}>
                     <li >
                         <p>{image.description?image.description:'No Description'}</p>
                         <br/>
                         <img src={image.url} alt={image.posterName} width="500" height="600"/>
                         <br/>
                         <p>{image.posterName?image.posterName:'No User'}</p>
                         <br/>
                         <Button variant='outlined' type='button' onClick={(e)=>{e.preventDefault(); handleBin(image)}}>{image.binned?'Remove from Bin':'Add to Bin'}</Button>
                         &nbsp;&nbsp;
                         {del ? <Button variant='outlined' onClick={(e)=>{e.preventDefault(); handleDelete(image)}}>Delete Post</Button> : ''}
                         <br/><br/>
                     </li>
                     <br/><br/>
                     </div>
                );   
}

}

export default Home;