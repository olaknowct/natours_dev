import '@babel/polyfill';
import { displayMap } from '/leaflet.js';
import { login } from './login';

// DOM ELEMENTS
const hasMap = document.getElementById('map');
const loginForm = document.querySelector('.form');
console.log(hasMap);

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
