import { getData, setData, setStartedAt, resetTotal } from './storage.js';
import { msInADay, cutOffHour, getCurrentDayStart } from './dateTime.js';

const updateChart = (labels, values) => {
  const ctx = document.getElementById('chart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'hours wasted',
        data: values,
        backgroundColor: 'rgba(255, 99, 132, 1)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
};

const getPreviousDays = (start, number = 7) => {
  const days = [];
  let newStart = start;
  for (let i = 0; i < number; i++) {
    days.push(newStart -= msInADay);
  }
  days.reverse();
  return days;
};

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const getDayLabel = (time) => {
  return dayLabels[(new Date(parseInt(time, 10))).getDay()];
};
const msToHours = (ms) => Math.round(ms / 100 / 60 / 60) / 10;

(async () => {
  const { archive } = await getData({ archive: [] });

  const days = getPreviousDays(getCurrentDayStart());

  const labels = [];
  const values = [];
  for (const date of days) {
    labels.push(getDayLabel(date));
    values.push(msToHours(archive[date]) || 0);
  }

  updateChart(labels, values);
})();