import Backbone from 'backbone';

export default Backbone.Model.extend({
    initialize: function (options) {
        this.options = options;
    },
    url: function () {
       return "/history/" + this.options.stateName+ "?tm=" + new Date().getTime();
    }
});