import {gql} from '@apollo/client';

const GET_UNSPLASHIMAGES = gql`
query ($pageNum: Int) {
    unsplashImages(pageNum: $pageNum) {
    id
    url
    posterName
    description
    userPosted
    binned
    numBinned
  }
}`;

  const GET_USERIMAGES = gql`
  query {
    userPostedImages{
    id
    url
    posterName
    description
    userPosted
    binned
    numBinned
  }
}`;

  const GET_BINNEDIMAGES = gql`
  query {
    binnedImages{
    id
    url
    posterName
    description
    userPosted
    binned
    numBinned
  }
}`;

const GET_POPULAR = gql`
query{
    getTopTenBinnedPosts{
        id
        url
        posterName
        description
        userPosted
        binned
        numBinned  
    }

}`;

  const DELETE_IMAGE = gql`
  mutation deleteImage($id: ID!){
  deleteImage(id: $id) {
    id
    url
    posterName
    description
    userPosted
    binned
    numBinned
  }
}`;

const ADD_IMAGE = gql`
  mutation uploadImage($url: String!, $description: String, $posterName: String) {
    uploadImage(url: $url, description: $description, posterName: $posterName,) {
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }`;

const EDIT_IMAGE = gql`
  mutation updateImage($id: ID!, $url: String, $posterName: String, $description: String, $userPosted: Boolean, $binned: Boolean, $numBinned: Int!) {
    updateImage(id: $id, url: $url, posterName: $posterName, description: $description, userPosted: $userPosted, binned: $binned, numBinned: $numBinned) {
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }`;

  let exported = {
    GET_UNSPLASHIMAGES,
    GET_USERIMAGES,
    GET_BINNEDIMAGES,
    GET_POPULAR,
    DELETE_IMAGE,
    ADD_IMAGE,
    EDIT_IMAGE
  };
  
  export default exported;