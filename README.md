
# Network Assisted Genomic Analysis React web-app
This app was created as a UI frontend to the [NAGA service](http://github.com/shfong/naga) created in the Ideker lab, as a more user friendly interface to the [REST API](http://nbgwas.ucsd.edu/rest/v1) that exposes the analysis tool.

The latest release of the app is deployed at http://nbgwas.ucsd.edu/

__NOTE: This app is under constant development and may change without warning.__

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

This is a single page application built on ReactJS, and requires Node and NPM to build.


### Installing

Clone this repository and install the dependencies

```bash
git clone http://github.com/brettjsettle/nbgwas-frontend
cd nbgwas-frontend
npm install
```

To test the app locally, run

```bash
npm start
```
Try running the analysis with the sample file and UUID.

## Deployment

The version number is located in `package.json`, `src/assets/config.json`, and github tags. Update the version in all places before releasing.

We use semantic versioning for deploying the app, via Github tagging. Once a version is tagged, build the static production version and deploy it to your home directory on the nbgwas server.
```bash
npm run build
npm run deploy # or npm run stage to push to nbgwas-stage.ucsd.edu
```

Connect to the server you deployed to and run `mv frontend /var/www/html/###` where ### is the version of the release. On the stage and production server, __the index.html file must be updated to redirect to the subdirectory of the latest version__

### Local Testing FAQ
Using the `npm start` command to test locally causes the app to forward all requests to the `proxy` variable in `package.json`. If testing a different version of the REST API, change this variable. This variable is ignored when the project is deployed.

The `homepage` variable is set to `"."` so that the app can be published to any domain name (`nbgwas.ucsd.edu` or `nbgwas.ucsd.edu/staging`).

## Future Goals
The paper for NAGA is on its way to being published and will be available via link soon.


## Authors

See the list of [contributors](https://github.com/brettjsettle/nbgwas-frontend/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
