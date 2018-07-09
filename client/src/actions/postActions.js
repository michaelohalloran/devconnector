import {
    GET_POST, 
    GET_POSTS, 
    POST_LOADING, 
    ADD_POST,
    DELETE_POST,
    GET_ERRORS
} from './types';

import axios from 'axios';

export const addPost = postData => dispatch => {
    axios
        .post('/api/posts', postData)
        .then(res=>dispatch({
            type: ADD_POST,
            payload: res.data
            })
        )
        .catch(err=> {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        });
}

export const getPosts = () => dispatch => {
    dispatch(setPostLoading());
    axios
        .get('/api/posts')
        .then(res=>
            dispatch({
                type: GET_POSTS,
                payload: res.data
            })
        )
        .catch(err=> {
            dispatch({
                type: GET_ERRORS,
                payload: null
        });
    })
}

export const deletePost = (postId) => dispatch => {
    axios
        .delete(`/api/posts/${postId}`)
        .then(res=> 
            dispatch({
                type: DELETE_POST,
                payload: postId
            })
        )
        .catch(err=> 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        )
}

//set loading state
export const setPostLoading = () => {
    return {
        type: POST_LOADING
    }
}

//Add Like

export const addLike = (postId) => dispatch => {
    axios   
        .post(`/api/posts/like/${postId}`)
        .then(res=> dispatch(getPosts()))
        .catch(err=> 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        )
}

//Add unlike
export const removeLike = (postId) => dispatch => {
    axios   
        .post(`/api/posts/unlike/${postId}`)
        .then(res=> dispatch(getPosts()))
        .catch(err=> 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        )
}

export const getPost = postId => dispatch => {
    dispatch(setPostLoading());
    axios
        .get(`/api/posts/${postId}`)
        .then(res=> 
            dispatch({
                type: GET_POST,
                payload: res.data
            })
        )
        .catch(err=>
            dispatch({
                type: GET_POST,
                payload: null
            })
        )
}