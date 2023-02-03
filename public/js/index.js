import '@babel/polyfill';
import { displayMap } from '/leaflet.js';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';

// DOM ELEMENTS
const hasMap = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataform = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

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
if (userDataform)
  userDataform.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateSettings({ name, email }, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').innerHTML = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').innerHTML = 'Save password';

    // clear content input
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
