# Info about this React App

This is a guide with some useful information about this React Application.

## Steps to run the application locally

1. `npm install`
2. `npm start`

OBS: Remember to start the server to be able to access server responses.

## Deployment

1. Make sure the `hostname` in `globalConsts.js` is set to the live server.
2. `npm run build`
3. Push the `build` folder only when deploying.
4. The `.htaccess` file is not in the build folder but should always be on the same level in the deployment. Only think about this step if the file is manually removed from the live server.

## General info

`App.js` handles all the routing. If a new route is added where the Menu should be shown, then a manual adding of the routes needs to be done in App.js and Index.js.

`index.js` is the top level of the tree and renders the application.

In the `public` folder all the information available to the public is set. This is includes metadata, favicon etc.

The service-worker files shouldn't be touched and handles the PWA functions.

The app is build with functional components and all components can be found in the `components` folder. Here each folder consists of atleast one parent component and a stylesheet.

To access the WordPress backend use the following url: `https://mit.holder100.dk/server/wordpress`
