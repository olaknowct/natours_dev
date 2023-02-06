import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url = `/api/v1/users/${
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
    showAlert('error', error.response.data.message);
  }
};

export const handleDisplayUserPhoto = (e) => {
  // Get File
  const imgFile = e.target.files?.[0];

  // Check file if image
  if (!imgFile?.type.startsWith('image/')) return;
  const reader = new FileReader();

  // Read File
  reader.readAsDataURL(imgFile);

  // Changed once done reading
  reader.addEventListener('load', () => {
    userImgEl.setAttribute('src', reader.result);
    // userNavImage.setAttribute('src', reader.result);
  });
};
