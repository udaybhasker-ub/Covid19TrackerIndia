import Marionette from 'backbone.marionette';
import AppRootView from './components/AppRoot/AppRoot.view';
import '../css/style.less';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

export default Marionette.Application.extend({
	region: '#appRegion',
	initialize: function() {
		this.appData = {};
		function renderer(template, data) {
			return template(data);
		  }
		  
		  Marionette.View.setRenderer(renderer);
		  Marionette.CollectionView.setRenderer(renderer);
	},
	onStart() {
		console.log("App started...");
		this.showView(new AppRootView());
	}
});