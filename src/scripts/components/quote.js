import * as config from '../config';
import { getJSON } from '../helpers';

const quoteElement = document.querySelector('.quote__item');
const updateButton = document.querySelector('.quote__update-button');

const updateQuote = async () => {
  try {
    const data = await getJSON(config.QUOTE_API_URL);
    const quote = data[0];

    quoteElement.innerHTML = `
      <p class="quote__text">“${quote.content}”</p>
      <cite class="quote__author">${quote.author}</cite>
    `;
  } catch (error) {
    quoteElement.innerHTML = `
      <p class="quote__text">${error}</p>
    `;
  }
};

const controlQuote = () => {
  updateQuote();
  updateButton.addEventListener('click', updateQuote);
};

export default controlQuote;
