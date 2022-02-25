export class Http {
  static HEADES = { 'Content-Type': 'application/json' };

  static async get(url) {
    try {
      return await request(url, 'GET');
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  static async post(url, data = {}) {
    try {
      return await request(url, 'POST', data);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  static async delete(url) {
    try {
      return await request(url, 'DELETE');
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  static async patch(url, data = {}) {
    try {
      return await request(url, 'PATCH', data);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}

async function request(url, method = 'GET', data) {
  const config = {
    method,
    headers: Http.HEADES,
  };

  if (method === 'POST' || method === 'PATCH') {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);
  return await response.json();
}
