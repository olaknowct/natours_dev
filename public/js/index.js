import '@babel/polyfill';
import { displayMap } from '/leaflet.js';
import { login, logout } from './login';
import { updateSettings, handleDisplayUserPhoto } from './updateSettings';
import { bookTour } from './stripe';

// DOM ELEMENTS
const hasMap = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataform = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const userImgEl = document.querySelector('.form__user-photo');
const userNavImage = document.querySelector('.nav__user-img');
const userImgInputEl = document.querySelector('#photo');
const bookBtn = document.getElementById('book-tour');

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
    // recreating multipart form data
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);
    updateSettings(form, 'data');
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

if (userImgInputEl)
  userImgInputEl.addEventListener('change', handleDisplayUserPhoto);

if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
