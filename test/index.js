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
formElem.onsubmit = async (e) => {
    e.preventDefault();

    let response = await axios.request({
        url: 'https://httpbin.org/post',
        method: 'post',
        data: new FormData(formElem),
        adapter: fetchAdapter,
    });

    console.log(response);
};