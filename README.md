# Bluebank

This is a project for the IBM application.

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.18.

Install PostgreSQL, Node and the following Node Packages:

~~~
$ npm -g i angular-cli typescript@next gulpjs/gulp.git#4.0
$ npm i
~~~

## Development server

Create a database called bluebank. Modify src/server/db.js according to database config.

`cd` to project folder in terminal, inside postgresql (`psql bluebank`), type `\i dump.sql` and `\i db_test.sql`.

Run `gulp` to run server

## Build and see the site

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build. Look at [http://localhost:3000](http://localhost:3000).

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Deploying to Github Pages

Run `ng github-pages:deploy` to deploy to Github Pages.

## Further help

To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Technical Info

Below are technical information for justifying the choice, for example frameworks, methodologies, etc.

### Front-end

For Front-end, we used the newest AngularJS 2 version, because ease of use and web development with concepts like OO (thanks to TypeScript and ECMAScript 2015), as well as apps. 

### Back-end

NodeJS was chosed for backend, together with KoaJS, because they are modern platforms and are in constant update by the community.

For authentication, we used Json Web Tokens (JWT), a new and compact way to transfer claims (like permissions) between a pair, which is useful for representing authorizations in a web request. Public and Private RSA keys can be used for assymmetric protection.  

For database, we use PostGreSQL, because of its robustness to represent large datasets, and easily to link to geolocation, which is great for project extensions, like to discover the nearest bank branch.

### Metodologias

#### Git/GitFlow
o git é utilizado como repositório para versionamento do código. O 
GitFlow é uma workflow para organizar as branches de acordo com níveis de estabilidade (ex: master é o mais estável, develop é mais atualizado, etc...)
####  Kanban
Utilizado para categorizar visualmente as tarefas de acordo com seu estado de desenvolvimento. 

#### Scrum
