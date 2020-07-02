// First we need to import axios.js
import axios from 'axios';
import {Auth} from './auth'

const mode = 'dev'
// Next we make an 'instance' of it
const instance = axios.create({
// .. where we make our configurations
    baseURL:  mode === 'dev' ? 'https://dev-rest-api.deplaza.id/v1/' : 'https://rest-api.deplaza.id/v1/'
});

// Where you would set stuff like your 'Authorization' header, etc ...
instance.defaults.headers.common['Authorization'] = `Bearer ${Auth()}`;

// Also add/ configure interceptors && all the other cool stuff



export default instance;