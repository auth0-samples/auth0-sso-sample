# app2.com

This is the app2.com for the SSO example. Remember to start all 3 apps to try everything out and to [configure `/etc/hosts` correctly]()

#Running the example
In order to run the example you need to have npm and nodejs installed.

You also need to set the ClientSecret, ClientId and Domain for your Auth0 app as enviroment variables with the following names respectively: `AUTH0_CLIENT_SECRET`, `AUTH0_CLIENT_ID`, `AUTH0_DOMAIN` and `AUTH0_CALLBACK_URL`.

For that, if you just create a file named `.env` in the directory and set the values like the following, the app will just work:

````bash
# .env file
AUTH0_CLIENT_SECRET=myCoolSecret
AUTH0_CLIENT_ID=myCoolClientId
AUTH0_DOMAIN=myCoolDomain
AUTH0_CALLBACK_URL=myCallback
````

Once you've set those 3 enviroment variables, just run `node server.js` and try calling [http://app3.com:3002/](http://app3.com:3002/)
