import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const dateInput = document.getElementById('datetime-picker');
const startButton = document.querySelector('[data-start]');
let selectedEndDate = null;

const datePickerOptions = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        selectedEndDate = selectedDates[0];
        validateStartButton(selectedEndDate);
    },
};

flatpickr(dateInput, datePickerOptions);

startButton.addEventListener('click', initiateCountdown);

function initiateCountdown() {
    startButton.disabled = true;
    dateInput.disabled = true;

    const countdownInterval = setInterval(() => {
        const timeRemaining = selectedEndDate - new Date();

        if (timeRemaining <= 0) {
            clearInterval(countdownInterval);
            updateTimerDisplay(0, 0, 0, 0);
            resetInputs(); 
            return;
        }

        const timeParts = calculateTimeParts(timeRemaining);
        updateTimerDisplay(timeParts.days, timeParts.hours, timeParts.minutes, timeParts.seconds);
    }, 1000);
}

function calculateTimeParts(ms) {
    const msPerSecond = 1000;
    const msPerMinute = msPerSecond * 60;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;

    return {
        days: Math.floor(ms / msPerDay),
        hours: Math.floor((ms % msPerDay) / msPerHour),
        minutes: Math.floor(((ms % msPerDay) % msPerHour) / msPerMinute),
        seconds: Math.floor((((ms % msPerDay) % msPerHour) % msPerMinute) / msPerSecond),
    };
}

function updateTimerDisplay(days, hours, minutes, seconds) {
    document.querySelector('[data-days]').textContent = formatWithLeadingZero(days);
    document.querySelector('[data-hours]').textContent = formatWithLeadingZero(hours);
    document.querySelector('[data-minutes]').textContent = formatWithLeadingZero(minutes);
    document.querySelector('[data-seconds]').textContent = formatWithLeadingZero(seconds);
}

function formatWithLeadingZero(value) {
    return String(value).padStart(2, '0');
}

function validateStartButton(date) {
    if (date < new Date()) {
        startButton.disabled = true;
        iziToast.error({
            title: 'Ошибка',
            message: 'Please choose a date in the future',
            position: 'topRight', // Убедитесь, что позиция установлена
            timeout: 5000, // Время показа уведомления
            close: false // Отключаем возможность закрытия
        });
    } else {
        startButton.disabled = false;
    }
}

function resetInputs() {
    dateInput.disabled = false; 
    startButton.disabled = true; 
}
