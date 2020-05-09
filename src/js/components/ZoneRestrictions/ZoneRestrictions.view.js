import Marionette from 'backbone.marionette';
import ZoneRestrictionsTemplate from './ZoneRestrictions.view.jst'

export default Marionette.View.extend({
    template: ZoneRestrictionsTemplate,
    tagName: 'div',
    className: '',
    id: 'zoneRestrictionContainer',
    initialize: function (options) {
        this.model = new Backbone.Model(options);
    },
    onRender: function () {
        
    },
});