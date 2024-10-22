import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const notificationForm = document.querySelector('.form');
notificationForm.addEventListener('submit', handleFormSubmit);

const promiseStates = {
  SUCCESS: 'fulfilled',
  ERROR: 'rejected',
};

function handleFormSubmit(event) {
  event.preventDefault();

  const inputData = new FormData(event.target);
  const dataObject = Object.fromEntries(inputData.entries());

  createPromise(dataObject)
    .then(({ delay, state }) => {
      displayNotification(delay, state);
    })
    .catch(({ delay, state }) => {
      displayNotification(delay, state);
    });

  event.target.reset();
}

function createPromise({ delay, state }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === promiseStates.SUCCESS) {
        resolve({ delay, state });
      } else {
        reject({ delay, state });
      }
    }, Number(delay));
  });
}

function displayNotification(delay, state) {
  const notificationMessage =
    state === promiseStates.SUCCESS
      ? `✅ Fulfilled promise in ${delay}ms`
      : `❌ Rejected promise in ${delay}ms`;
  const backgroundColor = state === promiseStates.SUCCESS ? '#b6d7a8' : '#EA9999';

  iziToast.show({
    icon: false,
    backgroundColor: `${backgroundColor}`,
    message: `${notificationMessage}`,
    messageColor: 'black',
    messageSize: '16',
    position: 'topRight',
    close: false,
    displayMode: 1,
  });
}
