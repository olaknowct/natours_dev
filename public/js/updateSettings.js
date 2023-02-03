import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url = `http://localhost:3000/api/v1/users/${
      type === 'password' ? 'updateMyPassword' : 'updateMe'
    }`;
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success')
      showAlert('success', `${type.toUpperCase()} updated successfully`);
  } catch (error) {
    console.log(error);
    showAlert('error', error.response.data.message);
  }
};
