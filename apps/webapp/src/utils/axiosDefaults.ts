import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3333';

axios.defaults.headers.Accept = 'application/json';
axios.defaults.headers['Content-Type'] = 'application/json';

axios.defaults.timeout = 10000;
