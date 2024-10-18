import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const dateField = document.getElementById('datetime-picker');
const activateBtn = document.querySelector('[data-start]');
let targetDate = null;

const calendarOptions = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(dates) {
        targetDate = dates[0];
        checkStartBtn(targetDate);
    },
};

flatpickr(dateField, calendarOptions);

activateBtn.addEventListener('click', startCountdown);

function startCountdown() {
    activateBtn.disabled = true;
    dateField.disabled = true;

    const countdownTimer = setInterval(() => {
        const remainingTime = targetDate - new Date();

        if (remainingTime <= 0) {
            clearInterval(countdownTimer);
            displayTime(0, 0, 0, 0);
            resetInputs(); // Сброс активных элементов после остановки таймера
            return;
        }

        const timeValues = convertMilliseconds(remainingTime);
        displayTime(timeValues.days, timeValues.hours, timeValues.minutes, timeValues.seconds);
    }, 1000);
}

function convertMilliseconds(ms) {
    const secondsInMs = 1000;
    const minutesInMs = secondsInMs * 60;
    const hoursInMs = minutesInMs * 60;
    const daysInMs = hoursInMs * 24;

    return {
        days: Math.floor(ms / daysInMs),
        hours: Math.floor((ms % daysInMs) / hoursInMs),
        minutes: Math.floor(((ms % daysInMs) % hoursInMs) / minutesInMs),
        seconds: Math.floor((((ms % daysInMs) % hoursInMs) % minutesInMs) / secondsInMs),
    };
}

function displayTime(days, hours, minutes, seconds) {
    document.querySelector('[data-days]').textContent = padZero(days);
    document.querySelector('[data-hours]').textContent = padZero(hours);
    document.querySelector('[data-minutes]').textContent = padZero(minutes);
    document.querySelector('[data-seconds]').textContent = padZero(seconds);
}

function padZero(value) {
    return String(value).padStart(2, '0');
}

function checkStartBtn(date) {
    if (date < new Date()) {
        activateBtn.disabled = true;
        iziToast.error({ title: 'Ошибка', message: 'Please choose a date in the future' });
    } else {
        activateBtn.disabled = false;
    }
}

function resetInputs() {
    dateField.disabled = false; // Активируем поле ввода
    activateBtn.disabled = true; // Кнопка остаётся неактивной
}
