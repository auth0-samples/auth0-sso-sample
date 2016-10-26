$(document).ready(function () {

  // hide the page in case there is an SSO session (to avoid flickering)
  document.body.style.display = 'none';

  // instantiate Lock
  var lock = new Auth0Lock('QLxSuRiYf0mkkzYp8qZgNq1tBkesd8Sq', 'auth0pnp.auth0.com');
  var auth0 = new Auth0({
    domain: 'auth0pnp.auth0.com',
    clientID: 'QLxSuRiYf0mkkzYp8qZgNq1tBkesd8Sq',
    callbackOnLocationHash: true
  });

  // Handle authenticated event to store id_token in localStorage
  lock.on("authenticated", function (authResult) {
    isAuthCallback = true;

    lock.getProfile(authResult.idToken, function (error, profile) {
      if (error) {
        // Handle error
        return;
      }

      localStorage.setItem('userToken', authResult.idToken);

      goToHomepage(authResult.state, authResult.idToken);
      return;
    });
  });

  var isAuthCallback = false;

  // Get the user token if we've saved it in localStorage before
  var idToken = localStorage.getItem('userToken');
  if (idToken) {
    // This would go to a different route like
    // window.location.href = '#home';
    // But in this case, we just hide and show things
    goToHomepage(getQueryParameter('targetUrl'), idToken);
    return;
  } else {
    // user is not logged, check whether there is an SSO session or not
    auth0.getSSOData(function (err, data) {
      if (!isAuthCallback && !err && data.sso) {
        // there is! redirect to Auth0 for SSO
        auth0.signin({
          connection: data.lastUsedConnection.name,
          scope: 'openid name picture',
          params: {
            state: getQueryParameter('targetUrl')
          }
        });
      } else {
        // regular login
        document.body.style.display = 'inline';
      }
    });
  }

  // Showing Login
  $('.btn-login').click(function (e) {
    e.preventDefault();
    lock.show({
      auth: {
        params: {
          scope: 'openid name picture'
        }
      }
    });
  });

  // Sending token in header if available
  /*    $.ajaxSetup({
        'beforeSend': function(xhr) {
          if (localStorage.getItem('userToken')) {
            xhr.setRequestHeader('Authorization',
                  'Bearer ' + localStorage.getItem('userToken'));
          }
        }
      });*/

  $('.btn-api').click(function (e) {
    // Just call your API here. The header will be sent
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


});
