import axios from 'axios';
import fetchAdapter from '..';

window.axios = axios
window.onload = async function () {
  try {
    const data = await axios.request({
      url: '/package.json',
      method: 'get',
      adapter: fetchAdapter,
    });
    document.getElementById('app').append(JSON.stringify(data, null, 4));
  } catch (e) {
    console.log(e);
  }
};
