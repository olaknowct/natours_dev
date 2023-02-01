import '@babel/polyfill';
import { displayMap } from '/leaflet.js';
import { login, logout } from './login';

// DOM ELEMENTS
const hasMap = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('.nav__el--logout');

// Delegate
if (hasMap) {
  const locations = JSON.parse(hasMap.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);
