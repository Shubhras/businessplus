// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  production: false,
  hmr: false,

  //apiurl: 'http://139.59.83.155/businessplus/public/api'
  // apiurl: 'http//115.166.143.134/businessplus/public/index.php/api'
  // apiurl:	'http://localhost/businessplus/public/index.php/api'
  // apiurl: 'http://139.59.83.155/stagebusinessplus/public'
  //apiurl: 'http://115.166.143.134:80/businessplus/public/index.php/api'
  //  apiurl: 'http://localhost:8000/businessplus/public/index.php'
   apiurl: 'http://localhost:8000/index.php/api' 
  //apiurl: 'http://194e77219fab.ngrok.io/businessplus/public/index.php/api'
  //apiurl:	'http://localhost/businessplus/public/index.php/api'
  // apiurl:	'http://139.59.83.155/businessplus/public/index.php/api'
};
/*

 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
