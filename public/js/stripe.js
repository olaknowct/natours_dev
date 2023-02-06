import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51IL779HTeZ2E9R9W6hgy6RMYfQ5aDqYlyA7NbdiMsyQ6wDWXKtGeErMpSkHZ4NOobNVwZZnjEhmsqruj32vXs24T00eXHvqmmV'
);

export const bookTour = async (tourId) => {
  try {
    // Get Checkout session from API
    const session = await axios({
      method: 'GET',
      url: `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`,
    });

    // Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    console.log(error);
    showAlert(error);
  }
};
