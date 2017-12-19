$(document).ready(function () {

  const AUTH0_CLIENT_ID = 'ZjAxVwIFlBawtCS3L1Pm9AOghYeDaIlZ';
  const AUTH0_DOMAIN = 'auth0pnp.auth0.com';

  // hide the page in case there is an SSO session (to avoid flickering)
  document.body.style.display = 'none';

  const webAuth = new auth0.WebAuth({
      domain: AUTH0_DOMAIN,
      clientID: AUTH0_CLIENT_ID,
      audience: 'https://' + AUTH0_DOMAIN + '/userinfo',
      scope: 'openid profile',
      responseType: 'token id_token',
      redirectUri: 'http://app2.com:3001'
  });

  var isAuthCallback = false;

  // Get the user token if we've saved it in localStorage before
  var idToken = localStorage.getItem('idToken');
  if (idToken) {
    // This would go to a different route like
    // window.location.href = '#home';
    // But in this case, we just hide and show things
    goToHomepage(getQueryParameter('targetUrl'), idToken);
    return;
  } else {
    // If user is not signed in, check if we have an SSO session
    webAuth.checkSession({
      state: getQueryParameter('targetUrl')
    }, function(err, result) {
      if (err) {
        // If no SSO session was found, display the normal login
        document.body.style.display = 'inline';
      } else {
        // If authentication via SSO was successful, then display the home page
        saveAuthResult(result);
        goToHomepage(result.state, result.idToken);
      }
    })
  }

  // Showing Login
  $('.btn-login').click(function (e) {
    e.preventDefault();
    webAuth.authorize();
  });

  function goToHomepage(state, token) {
    // Instead of redirect, we just show boxes
    document.body.style.display = 'inline';
    $('.login-box').hide();
    $('.logged-in-box').show();
    var profile = jwt_decode(token);
    $('.name').text(profile.name);
    if (state) {
      $('.url').show();
      $('.url span').text(state);
    }
  }

  function getQueryParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&]*)"),
      results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  function saveAuthResult (result) {
    localStorage.setItem('idToken', result.idToken);
    localStorage.setItem('accessToken', result.accessToken);
    localStorage.setItem('expirationDate', Date.now() + Number.parseInt(result.expiresIn) * 1000);
  }

  webAuth.parseHash(window.location.hash, function (err, result) {
    if (err) {
        console.error(err);
    } else if (result) {
        saveAuthResult(result);
    }
  });
});
