import { timeoutValue } from './config.js';
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
export const getJson = async function (url) {
  try {
    const fetchData = fetch(url);
    const res = await Promise.race([fetchData, timeout(timeoutValue)]);

    // console.log(res);
    const data = await res.json();
    // console.log(data);
    if (!res.ok) throw new Error(`${data.message},${data.status}`);
    return data;
  } catch (err) {
    console.error(`${err} from helper`);
    throw err;
  }
};
export const sendJson = async function (url, uploadRecipe) {
  try {
    const fetchData = fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'APPLICATION/json' },
      body: JSON.stringify(uploadRecipe),
    });
    const res = await Promise.race([fetchData, timeout(timeoutValue)]);

    // console.log(res);
    const data = await res.json();
    // console.log(data);
    if (!res.ok) throw new Error(`${data.message},${data.status}`);
    return data;
  } catch (err) {
    console.error(`${err} from helper`);
    throw err;
  }
};
