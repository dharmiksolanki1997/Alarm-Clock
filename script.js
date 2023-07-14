const currentTime = document.querySelector("#current-time");
const setHours = document.querySelector("#hours");
const setMinutes = document.querySelector("#minutes");
const setSeconds = document.querySelector("#seconds");
const setAmPm = document.querySelector("#am-pm");
const setAlarmButton = document.querySelector("#submitButton");
const deleteAllButton = document.querySelector("#deleteAllButton");
const alarmContainer = document.querySelector("#alarms-container");

let intervalId;

window.addEventListener("DOMContentLoaded", () => {
  populateDropdown(setHours, 1, 12);
  populateDropdown(setMinutes, 0, 59);
  populateDropdown(setSeconds, 0, 59);
  intervalId = setInterval(getCurrentTime, 1000);
  fetchAlarms();
});

setAlarmButton.addEventListener("click", (e) => {
  e.preventDefault();
  const selectedTime = `${setHours.value}:${setMinutes.value}:${setSeconds.value} ${setAmPm.value}`;
  setAlarm(selectedTime);
});

deleteAllButton.addEventListener("click", deleteAllAlarms);

function populateDropdown(selectElement, start, end) {
  for (let i = start; i <= end; i++) {
    const option = document.createElement("option");
    const formattedValue = i.toString().padStart(2, "0");
    option.value = formattedValue;
    option.textContent = formattedValue;
    selectElement.appendChild(option);
  }
}

function getCurrentTime() {
  const currentTimeValue = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  currentTime.textContent = currentTimeValue;
  return currentTimeValue;
}

function setAlarm(time) {
  const alarmInterval = setInterval(() => {
    const currentTimeValue = getCurrentTime();
    if (time === currentTimeValue) {
      alert("Alarm Ringing");
    }
  }, 500);
  addAlarmToDOM(time, alarmInterval);
  saveAlarm(time);
}

function addAlarmToDOM(time, intervalId) {
  const alarmElement = document.createElement("div");
  alarmElement.classList.add("alarm", "d-flex");
  alarmElement.innerHTML = `
    <div class="time">${time}</div>
    <button class="btn delete-alarm" data-id="${intervalId}">Delete</button>
  `;
  const deleteButton = alarmElement.querySelector(".delete-alarm");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e, time, intervalId));
  alarmContainer.appendChild(alarmElement);
}

function saveAlarm(time) {
  let alarms = [];
  const alarmsString = localStorage.getItem("alarms");
  if (alarmsString) {
    alarms = JSON.parse(alarmsString);
  }
  if (!alarms.includes(time)) {
    alarms.push(time);
    alarms.sort((a, b) => new Date(a) - new Date(b)); // Sort alarms in ascending order
    localStorage.setItem("alarms", JSON.stringify(alarms));
  }
}

function fetchAlarms() {
  const alarmsString = localStorage.getItem("alarms");
  if (alarmsString) {
    const alarms = JSON.parse(alarmsString);
    alarms.forEach((alarm) => {
      setAlarm(alarm);
    });
  }
}

function deleteAlarm(event, time, intervalId) {
  clearInterval(intervalId);
  const alarmElement = event.target.parentElement;
  deleteAlarmFromLocalStorage(time);
  alarmElement.remove();
}

function deleteAlarmFromLocalStorage(time) {
  const alarmsString = localStorage.getItem("alarms");
  if (alarmsString) {
    let alarms = JSON.parse(alarmsString);
    const index = alarms.indexOf(time);
    if (index > -1) {
      alarms.splice(index, 1);
      localStorage.setItem("alarms", JSON.stringify(alarms));
    }
  }
}

function deleteAllAlarms() {
  const alarmElements = document.querySelectorAll(".alarm");
  alarmElements.forEach((element) => element.remove());
  localStorage.removeItem("alarms");
}

// Clear local storage on page load to prevent duplication
window.addEventListener("load", () => {
  localStorage.removeItem("alarms");
});
