import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  const url = '/api/v1/users/login';
  try {
    const res = await axios({
      method: 'POST',
      url, // this works because fe and be sits and hosting on the same place
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfull');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:3000/api/v1/users/logout',
    });

    // reload from the server not from the browser side
    if (res.data.status == 'success') location.reload(true);
  } catch (error) {
    showAlert('error', 'Error logging out ! try again.');
  }
};
