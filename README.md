# Why

I'm going to adopt PWA to my web applications and those web apps are heavily using Axios with the default XMLHTTPRequest adapter. Hence, I have to switch to Fetch adapter; However, Axios doesn't have an adapter for fetch API for now. So I write one to use while waiting for an offical one from Axios.

# Installation and Usage

You can install the adapter directly from this repository URL or feel free to copy its source code to your project.

``` sh
npm install axios
npm install @vespaiach/axios-fetch-adapter
```

There are two ways to use it:

1.  Create a new instance of Axios and pass this adapter in configuration

``` js
const instance = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  adapter: fetchAdapter
  ....
});
```

2.  Pass this adapter in each of request

``` js
axios.request({
  url: '/user',
  method: 'get',
  adapter: fetchAdapter
  ...
})
```

3.  Use with FormData 

``` js
axios.request({
  url: '/user',
  method: 'post',
  adapter: fetchAdapter
  data: new FormData(formId)
  ...
})
```

# Note

- Node 17.5 or later is required to use this adapter in Node environment.
