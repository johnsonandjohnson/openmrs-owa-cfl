# CFL UI for OpenMRS

## Prerequisites
* [Node.js](https://nodejs.org/en/)

## Deployment
1. Run `npm install && npm run build` in the root directory. This should create a file called `cfl.zip`.
2. Log in to OpenMRS as an admin.
3. Go to `System Administration` -> `Advanced Administration` -> `Open Web Apps Module` -> `Manage Apps`.
4. Upload `cfl.zip`. The file name must be exactly the same for the module to work correctly.
5. The app is up and running!

In order to add cfl icons to the home dashboard:
1. Go to System Administration -> Manage Apps
2. Add the following app definitions:
* App ID: `cflui.registerPatient`, Definition: [click here](public/app/registerPatient.json)
* App ID: `cflui.findPatient`, Definition: [click here](public/app/findPatient.json)
* App ID: `cflui.registerCaregiver`, Definition: [click here](public/app/registerCaregiver.json)
* App ID: `cflui.findCaregiver`, Definition: [click here](public/app/findCaregiver.json)
* App ID: `cflui.configureMetadataApps`, Definition: [click here](public/app/configureMetadataApps.json)

## Available Scripts

In the project directory, you can run:

### `npm run build`

Builds the app for production.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!
### `npm watch`

Development: deploys the app to `~/.cfl-dev` when files change. 
