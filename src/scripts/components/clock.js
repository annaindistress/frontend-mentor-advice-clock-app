import * as config from '../config';
import { getJSON } from '../helpers';

const clockElement = document.querySelector('.clock');
const timeElement = document.querySelector('.time');
const infoListElement = document.querySelector('.info__list');

const userInfo = {
  ip: '',
  country: '',
  city: '',
  timezone: '',
  timezoneCode: '',
  dayOfYear: 0,
  dayOfWeek: 0,
  weekNumber: 0,
  theme: {
    title: '',
    theme: '',
  },
};

const controlInfo = async () => {
  try {
    const ipData = await getJSON(config.IP_API_URL);
    if (ipData.status !== 'success') throw new Error(ipData.message);
    userInfo.ip = ipData.query;
    userInfo.country = ipData.country;
    userInfo.city = ipData.city;

    const timeData = await getJSON(`${config.TIME_API_URL}${userInfo.ip}`);
    userInfo.timezone = timeData.timezone;
    userInfo.timezoneCode = getTimezone();
    userInfo.dayOfYear = timeData.day_of_year;
    userInfo.dayOfWeek = timeData.day_of_week;
    userInfo.weekNumber = timeData.week_number;
    userInfo.theme = getTheme();

    renderInfo();

    const timeNumbersElement = document.querySelector('.time__numbers');
    window.setInterval(() => {
      timeNumbersElement.innerHTML = updateTime();
      userInfo.theme = getTheme();
      document.documentElement.dataset.theme = userInfo.theme.theme;
    }, 1000);
  } catch (error) {
    userInfo.theme = getTheme();
    timeElement.innerHTML = `
      <p class="time__daytime">
        ${error}
      </p>
    `;
  } finally {
    document.documentElement.dataset.theme = userInfo.theme.theme;
  }
};

const updateTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}`;
};

const getTimezone = () => {
  return new Date()
    .toLocaleDateString(config.LOCALE, config.TIMEZONE_CODE_CONFIG)
    .slice(4)
    .split(' ')
    .reduce((acc, cur) => `${acc}${cur[0]}`, '');
};

const renderInfo = () => {
  timeElement.innerHTML = `
    <p class="time__daytime">
      <svg class="time__daytime-icon" viewBox="0 0 24 24" width="24">
        <use href="/images/sprite.svg#${
          userInfo.theme.theme === 'day' ? 'sun' : 'moon'
        }"></use>
      </svg>
      Good ${userInfo.theme.title}
      <span class="mobile-hide">, it's currently</span>
    </p>
    <p class="time__item">
      <span class="time__numbers">${updateTime()}</span>
      ${userInfo.timezoneCode}
    </p>
    <p class="time__place">In ${userInfo.city}, ${userInfo.country}</p>
    <button class="time__toggle-button" type="button">
      More
      <svg class="time__toggle-icon" viewBox="0 0 40 40" width="32">
        <use href="/images/sprite.svg#arrow-up"></use>
      </svg>
    </button>
  `;
  infoListElement.innerHTML = `
    <div class="info__item info__item--timezone">
      <dt class="info__term">Current timezone</dt>
      <dd class="info__definition">${userInfo.timezone}</dd>
    </div>
    <div class="info__item info__item--day-year">
      <dt class="info__term">Day of the year</dt>
      <dd class="info__definition">${userInfo.dayOfYear}</dd>
    </div>
    <div class="info__item info__item--day-week">
      <dt class="info__term">Day of the week</dt>
      <dd class="info__definition">${userInfo.dayOfWeek}</dd>
    </div>
    <div class="info__item info__item--week">
      <dt class="info__term">Week number</dt>
      <dd class="info__definition">${userInfo.weekNumber}</dd>
    </div>
  `;
};

const getTheme = () => {
  const hour = new Date().getHours();

  switch (true) {
    case hour >= 5 && hour < 12: {
      return {
        title: 'morning',
        theme: 'day',
      };
    }
    case hour >= 12 && hour < 17: {
      return {
        title: 'afternoon',
        theme: 'day',
      };
    }
    case hour >= 17 && hour < 21: {
      return {
        title: 'evening',
        theme: 'night',
      };
    }
    default: {
      return {
        title: 'night',
        theme: 'night',
      };
    }
  }
};

const toggleInfo = button => {
  clockElement.classList.toggle('clock--open');
  button.blur();
};

const controlClock = () => {
  controlInfo();

  timeElement.addEventListener('click', evt => {
    const button = evt.target.closest('.time__toggle-button');
    if (!button) return;
    toggleInfo(button);
  });
};

export default controlClock;
