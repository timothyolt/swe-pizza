// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBfLSdUDMizcr0wf__9ui3GtzaZVY0-AbI",
    authDomain: "swe-pizza.firebaseapp.com",
    databaseURL: "https://swe-pizza.firebaseio.com",
    projectId: "swe-pizza",
    storageBucket: "swe-pizza.appspot.com",
    messagingSenderId: "478783840144"
  }
};
