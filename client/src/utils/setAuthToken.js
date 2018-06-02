import axios from 'axios';

const setAuthToken =token => {
    if(token) {
        //apply this to every request
        axios.defaults.headers.common['Authorization'] = token;
    }
    else {
        //delete auth header if there is no token
        delete axios.defaults.headers.common['Authorization'];
    }
}


export default setAuthToken;