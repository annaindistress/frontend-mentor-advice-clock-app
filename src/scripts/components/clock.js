import * as config from '../config';
import { getJSON } from '../helpers';
import controlTheme from './theme';

const clockElement = document.querySelector('.clock');
const timeElement = document.querySelector('.time');
const infoListElement = document.querySelector('.info__list');

const abbreviateContryName = countryName =>
  countryName.split(' ').reduce((acc, cur) => `${acc}${cur[0]}`, '');

const getTimezoneCode = datetime =>
  new Date(datetime)
    .toLocaleDateString('en-US', { day: '2-digit', timeZoneName: 'long' })
    .slice(4)
    .split(' ')
    .reduce((acc, cur) => `${acc}${cur[0]}`, '');

const loadData = async () => {
  try {
    const ipData = await getJSON(config.IP_API_URL);
    if (!ipData) throw new Error(ipData.message);
    const { ip, country_name: country, city } = ipData;

    const timeData = await getJSON(`${config.TIME_API_URL}/${ip}`);
    const {
      datetime,
      timezone,
      abbreviation,
      day_of_year: dayOfYear,
      day_of_week: dayOfWeek,
      week_number: weekNumber,
    } = timeData;

    return {
      theme: document.documentElement.dataset.theme,
      ip,
      country:
        country.split(' ').length > 1 ? abbreviateContryName(country) : country,
      city,
      timezone,
      timezoneCode:
        abbreviation[0] === '+' || abbreviation[0] === '-'
          ? getTimezoneCode(datetime)
          : abbreviation,
      dayOfYear,
      dayOfWeek,
      weekNumber,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const getTimeOfDay = datetime => {
  const hour = new Date(datetime).getHours();

  switch (true) {
    case hour >= 5 && hour < 12:
      return 'morning';
    case hour >= 12 && hour < 17:
      return 'afternoon';
    case hour >= 17 && hour < 21:
      return 'evening';
    default:
      return 'night';
  }
};

const getTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}`;
};

const render = data => {
  timeElement.innerHTML = `
    <h2 class="sr-only">Clock</h2>
    <p class="time__daytime">
      <svg class="time__daytime-icon" viewBox="0 0 24 24" width="24">
        <use href="/frontend-mentor-clock-app/images/sprite.svg#${
          data.theme === 'day' ? 'sun' : 'moon'
        }"></use>
      </svg>
      Good ${getTimeOfDay(data.datetime)}
      <span class="mobile-hide">, it's currently</span>
    </p>
    <p class="time__item">
      <span class="time__numbers">${getTime()}</span>
      ${data.timezoneCode}
    </p>
    <p class="time__place">In ${data.city}, ${data.country}</p>
    <button class="time__toggle-button" type="button">
      More
      <svg class="time__toggle-icon" viewBox="0 0 40 40" width="32">
        <use href="/frontend-mentor-clock-app/images/sprite.svg#arrow-up"></use>
      </svg>
    </button>
  `;
  infoListElement.innerHTML = `
    <div class="info__item info__item--timezone">
      <dt class="info__term">Current timezone</dt>
      <dd class="info__definition">${data.timezone}</dd>
    </div>
    <div class="info__item info__item--day-year">
      <dt class="info__term">Day of the year</dt>
      <dd class="info__definition">${data.dayOfYear}</dd>
    </div>
    <div class="info__item info__item--day-week">
      <dt class="info__term">Day of the week</dt>
      <dd class="info__definition">${data.dayOfWeek}</dd>
    </div>
    <div class="info__item info__item--week">
      <dt class="info__term">Week number</dt>
      <dd class="info__definition">${data.weekNumber}</dd>
    </div>
  `;
};

const toggleInfo = button => {
  clockElement.classList.toggle('clock--open');
  button.blur();
};

const controlClock = async () => {
  try {
    const data = await loadData();
    render(data);

    const timeNumbersElement = document.querySelector('.time__numbers');
    window.setInterval(() => {
      timeNumbersElement.innerHTML = getTime();
      controlTheme();
    }, 1000);

    timeElement.addEventListener('click', evt => {
      const button = evt.target.closest('.time__toggle-button');
      if (!button) return;
      toggleInfo(button);
    });
  } catch (error) {
    timeElement.innerHTML = `
      <p class="time__daytime">
        ${error}
      </p>
    `;
  }
};

export default controlClock;
