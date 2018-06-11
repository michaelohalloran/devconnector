import {
    GET_PROFILE, 
    PROFILE_LOADING, 
    CLEAR_CURRENT_PROFILE,
    GET_ERRORS,
    SET_CURRENT_USER
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