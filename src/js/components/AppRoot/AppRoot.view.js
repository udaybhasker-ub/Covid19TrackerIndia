import Marionette from 'backbone.marionette';
import appRootTemplate from './AppRoot.view.jst';
import MainView from '../MainView/MainView.view'

export default Marionette.View.extend({
    template: appRootTemplate,
    regions: {
        header: '#headerContainer',
        main: '#mainContainer',
    },
    onRender() {
        this.showChildView('main', new MainView());
    }
});

