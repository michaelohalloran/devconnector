import {
    GET_PROFILE, 
    PROFILE_LOADING, 
    CLEAR_CURRENT_PROFILE,
    GET_ERRORS,
    SET_CURRENT_USER,
    GET_PROFILES
} from './types';
import {logoutUser} from './authActions';
import axios from 'axios';


export const getCurrentProfile = ()=>dispatch=> {
    dispatch(setProfileLoading());
    axios.get('/api/profile')
        .then(res=> {
            //the response is the profile; payload is its data
            dispatch({
                type: GET_PROFILE,
                payload: res.data
            });
        })
        //profiles are optional, so if there isn't one, we return empty {}
        .catch(err=> {
            dispatch({
                type: GET_PROFILE,
                payload: {}
            });
        })
}

//fetch all profiles
export const getProfiles = () => dispatch => {
    dispatch(setProfileLoading());
    axios.get('/api/profile/all')
        .then(res=>{
            dispatch({
                type: GET_PROFILES,
                payload: res.data
            });
        })
        .catch(err=>{
            dispatch({
                type: GET_PROFILES,
                payload: null
            });
        })
}

//get profiles by user handle
export const getProfileByHandle = handle => dispatch => {
    dispatch(setProfileLoading());
    axios.get(`/api/profile/handle/${handle}`)
        .then(res=>{
            dispatch({
                type: GET_PROFILE,
                payload: res.data
            });
        })
        .catch(err=>{
            dispatch({
                type: GET_PROFILE,
                payload: null
            });
        })
}



//create profile
export const createProfile = (profileData, history) => dispatch=> {
    axios.post('/api/profile', profileData)
        .then(res=> history.push('/dashboard'))
        .catch(err=>{
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        })
}


//this is to tell that a profile is loading
export const setProfileLoading = ()=> {
    return {
        type: PROFILE_LOADING
    }
}

//this is to remove user's profile upon logout
export const clearCurrentProfile = ()=> {
    return {
        type: CLEAR_CURRENT_PROFILE 
    }
}

export const deleteAccount = ()=> dispatch => {
    if(window.confirm('Are you sure?  This cannot be undone')) {
        axios.delete('/api/profile')
            .then(res=>
                dispatch(logoutUser())
            )
            .catch(err=>{
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                });
            })
    }
}

export const addExperience = (expData, history) => dispatch => {
    axios.post('/api/profile/experience', expData)
        .then(res=>history.push('/dashboard'))
        .catch(err=> {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        })
}

export const deleteExperience = (id) => dispatch => {
    axios.delete(`/api/profile/experience/${id}`)
        .then(res=>{
            dispatch({
                type: GET_PROFILE,
                payload: res.data
            });
        })
        .catch(err=>{
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })
}

export const deleteEducation = (id) => dispatch => {
    axios.delete(`/api/profile/education/${id}`)
        .then(res=>{
            dispatch({
                type: GET_PROFILE,
                payload: res.data
            });
        })
        .catch(err=>{
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })
}

export const addEducation = (eduData, history) => dispatch => {
    axios.post('/api/profile/education', eduData)
        .then(res=>history.push('/dashboard'))
        .catch(err=> {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        })
}