import SpotifyWebApi from 'spotify-web-api-node';

var spotifyApi = new SpotifyWebApi();

function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier));

  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function generateUrlWithSearchParams(url, params) {
  const urlObject = new URL(url);
  urlObject.search = new URLSearchParams(params).toString();

  return urlObject.toString();
}

function redirectToSpotifyAuthorizeEndpoint() {
  const codeVerifier = generateRandomString(64);

  generateCodeChallenge(codeVerifier).then((code_challenge) => {
    window.localStorage.setItem('code_verifier', codeVerifier);

    window.location = generateUrlWithSearchParams('https://accounts.spotify.com/authorize', {
      response_type: 'code',
      client_id,
      scope: 'user-read-private user-read-email',
      code_challenge_method: 'S256',
      code_challenge,
      redirect_uri
    });

    // If the user accepts spotify will come back to your application with the code in the response query string
    // Example: http://127.0.0.1:8080/?code=NApCCg..BkWtQ&state=profile%2Factivity
  });
}

function exchangeToken(code) {
  console.log('hä exchange');
  const code_verifier = localStorage.getItem('code_verifier');

  return fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: new URLSearchParams({
      client_id,
      grant_type: 'authorization_code',
      code,
      redirect_uri,
      code_verifier
    })
  })
    .then(addThrowErrorToFetch)
    .then((data) => {
      processTokenResponse(data);

      // clear search query params in the url
      window.history.replaceState({}, document.title, '/');
    })
    .catch(handleError);
}

function refreshToken() {
  try {
    fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: new URLSearchParams({
        client_id,
        grant_type: 'refresh_token',
        refresh_token
      })
    })
      .then(addThrowErrorToFetch)
      .catch(handleError)
      .then(processTokenResponse)
      .catch(handleError);
  } catch (error) {
    console.log(error);
  }
}

function handleError(error) {
  console.log(error);
}

async function addThrowErrorToFetch(response) {
  if (response.ok) {
    return response.json();
  } else if (response.status === 401) {
    refreshToken();
  } else {
    const error = await response.json();
    console.log(JSON.stringify({ response, error }));
  }
}

function logout() {
  localStorage.clear();
  window.location.reload();
}

function processTokenResponse(data) {
  console.log(data);

  access_token = data.access_token;
  refresh_token = data.refresh_token;

  const t = new Date();
  expires_at = t.setSeconds(t.getSeconds() + data.expires_in);

  localStorage.setItem('access_token', access_token);
  localStorage.setItem('refresh_token', refresh_token);
  localStorage.setItem('expires_at', expires_at);

  spotifyApi.setAccessToken(access_token);

  // load data of logged in user
  getUserData();
}

function getUserData() {
  fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('access_token')
    }
  })
    .then(async (response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log(await response.json());
      }
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

// Your client id from your app in the spotify dashboard:
// https://developer.spotify.com/dashboard/applications
const client_id = 'a5e226fa7aa74eda8de7679fa4c420e3';
const redirect_uri = 'http://localhost:3000'; // Your redirect uri

let access_token = localStorage.getItem('access_token') || null;
let refresh_token = localStorage.getItem('refresh_token') || null;
let expires_at = localStorage.getItem('expires_at') || null;

export default function login() {
  if (access_token === null) {
    redirectToSpotifyAuthorizeEndpoint();
  } else {
    getUserData();
  }
}

export {
  exchangeToken,
  refreshToken,
  logout,
  redirect_uri,
  client_id,
  access_token,
  refresh_token,
  spotifyApi
};
