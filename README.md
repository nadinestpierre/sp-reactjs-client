# sharepoint-starterpack
A frontend starter pack for Sharepoint projects at Golin. 

## Features

* Webpack 3 based.
* ES6 as a source.
* Exports in a [umd](https://github.com/umdjs/umd) format so your library works everywhere.
* Linting with [ESLint](http://eslint.org/).

## Process

```
ES6 source files
       |
       |
    webpack
       |
       +--- babel, eslint
       |
  ready to use
     library
  in umd format
```

## Getting started

1. Setting up the name of your library
  * Open `webpack.config.js` file and change the value of `libraryName` variable so it matches the name of your library.
  * Open `webpack.config.js` file and provide values for `siteUrl`, `username` and `password` to be able to upload assets to a site.
  * Open `package.json` file and change all occurrences of `sharepoint-starterpack` and `starterpack` so it matches the name of your library.
2. production mode
  * Run `npm install` to get the project's dependencies
  * Run `npm run prod` to produce a minified version of your library.
3. Development mode
  * Having all the dependencies installed run `npm run dev`. This command will generate a non-minified version of your library.
  * Run `npm run dev:upload` to produce a non-minified version of your library and upload *.js and *.css files to a site.

## Scripts

* `npm run prod` - produces a production version of your library.
* `npm run dev` - produces a development version of your library.
* `npm run prod:upload` - produces a production version of your library and uploads *.js and *.css files to a site.
* `npm run dev:upload` - produces a development version of your library and uploads *.js and *.css files to a site.
* `npm run prod:sync` - produces a production version of your library and copies folders from ./public to ./deployment/Assets.
* `npm run dev:sync` - produces a development version of your library and copies folders from ./public to ./deployment/Assets.

## Readings

* [Start your own JavaScript library using webpack and ES6](http://krasimirtsonev.com/blog/article/javascript-library-starter-using-webpack-es6)

## Additional libraries

* assets/js/vendor/camljs.js - simplifies creation of SharePoint CAML queries for client-side scripts. Read more: https://camljs.codeplex.com/.
* SPOCExt: https://github.com/golincode/SPOCExt.git - a library for working with lists, libraries, users and sites.
