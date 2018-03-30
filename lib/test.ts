import 'babel-polyfill';

// Find all the tests
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules
context.keys().map(context);
