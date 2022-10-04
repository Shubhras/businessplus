"use strict";
exports.__esModule = true;
exports.environment = void 0;
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
exports.environment = {
    production: false,
    hmr: false,
    apiurl: 'http://139.59.83.155/stagebusinessplus/public'
    // apiurl: 'http://139.59.83.155/maxhospital/public'
    //apiurl: 'http://139.59.83.155/businessplus/public'
    //apiurl: 'http://192.168.0.170:80/businessplus/public/index.php'
    //apiurl:	'http://localhost:80/businessplus/public/index.php'
};
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
