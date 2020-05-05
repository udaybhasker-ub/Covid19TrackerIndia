import 'jquery';
import App from './js/App';

jQuery(document).ready(() => {
	const app = new App();
	app.start();
});
console.log("index.js started");
// Needed for Hot Module Replacement
if(typeof(module.hot) !== 'undefined') {
	module.hot.accept() // eslint-disable-line no-undef  
  }