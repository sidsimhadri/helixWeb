import axios from 'axios';
import { Question, User } from '../types';

const API_URL = 'http://localhost:8000/api/questions/';
const AUTH_API_URL = 'http://localhost:8000/api/';

// Function to get CSRF token from cookies
const getCookie = (name: string): string | null => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

const csrftoken = getCookie('csrftoken');
console.log('CSRF Token:', csrftoken);

axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-CSRFToken'] = csrftoken;


axios.interceptors.request.use((config) => {
  const token = getCookie('csrftoken');
  console.log('Interceptor CSRF Token:', token);
  config.headers['X-CSRFToken'] = token;
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const getQuestions = () => {
  return axios.get(API_URL, {
    withCredentials: true,
  });
};

export const createQuestion = (question: Question) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user || typeof user.id !== 'number') {
    throw new Error('Invalid user data');
  }
  console.log('User Token:', user.token); 
  return axios.post(API_URL, {
    ...question,
    user: user.id, 
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${user.token}`,
    },
    withCredentials: true, 
  });
};

export const getQuestion = (id: number) => {
  return axios.get(`${API_URL}${id}/`, {
    withCredentials: true, 
  });
};

export const updateQuestion = (id: number, question: Question) => {
  return axios.put(`${API_URL}${id}/`, question, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
};

export const deleteQuestion = (id: number) => {
  return axios.delete(`${API_URL}${id}/`, {
    withCredentials: true, 
  });
};

export const upvoteQuestion = (id: number) => {
  return axios.put(`${API_URL}${id}/upvote/`, {}, {
    withCredentials: true, 
  });
};

export const downvoteQuestion = (id: number) => {
  return axios.put(`${API_URL}${id}/downvote/`, {}, {
    withCredentials: true, 
  });
};

export const loginUser = (credentials: { username: string; password: string }) => {
  if (!credentials || !credentials.username || !credentials.password) {
    return Promise.reject(new Error("User object is missing required fields."));
  }
  return axios.post(`${AUTH_API_URL}login/`, credentials, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, 
  }).then(response => {
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));  // Store the full user object from the response
    }
    return response.data;
  });
};

export const logoutUser = () => {
  localStorage.removeItem('user');
  return axios.post(`${AUTH_API_URL}logout/`, {}, {
    withCredentials: true, 
  });
};

export const registerUser = (user: User) => {
  if (!user || !user.username || !user.password) {
    return Promise.reject(new Error("User object is missing required fields."));
  }
  return axios.post(`${AUTH_API_URL}register/`, user, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, 
  }).then(response => {
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));  // Store the full user object from the response
    }
    return response.data;
  });
};