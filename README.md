# Connect for Life UI OWA for OpenMRS

## Prerequisites
* [Maven](https://maven.apache.org/install.html)

## Deployment
1. Run `mvn clean install` in the root directory. This should create a file called `target/cfl-<version>.zip`.
    1. Where `<version>` is the current version of the Connect for Life UI OWA.
1. Log in to OpenMRS as an admin.
1. Go to `System Administration` -> `Advanced Administration` -> `Open Web Apps Module` -> `Manage Apps`.
1. Rename the `target/cfl-<version>.zip` by removing the version, to `cfl.zip`.
1. Upload the `cfl.zip`. 
    1. The file name must be exactly the same for the module to work correctly, the OpenMRS uses filename to match URLs.
1. The app is up and running!

In order to add cfl icons to the home dashboard:
1. Go to System Administration -> Manage Apps
2. Add the following app definitions:
* App ID: `cflui.registerPatient`, Definition: [click here](public/app/registerPatient.json)
* App ID: `cflui.findPatient`, Definition: [click here](public/app/findPatient.json)
* App ID: `cflui.registerCaregiver`, Definition: [click here](public/app/registerCaregiver.json)
* App ID: `cflui.findCaregiver`, Definition: [click here](public/app/findCaregiver.json)
* App ID: `cflui.configureMetadataApps`, Definition: [click here](public/app/configureMetadataApps.json)


## Available Scripts

The Node project is wrapped in Maven. The Maven downloads correct node and npm, then runs the npm build.
It is perfectly fine to use Maven build for development, but in some cases it might be more convenient to run npm directly. 

If you are going to skip Maven wrapper, then make sure you use the correct node and npm versions.
The supported node and npm versions are located in `pom.xml` file.

To use npm, just run:

#### `npm run build`

Builds the app for production.\
It correctly bundles React in production mode and optimizes the build for the best performance.

**By wary,** that npm does not pack the project into ZIP file. 
In case of using NPM directly, you need to create ZIP file out of content of `build` directory by yourself.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

#### `npm watch`

Development: deploys the app to `~/.cfl-dev` when files change - facilitates hot-redeployment of FE changes.
