import Backbone from 'backbone';

export default Backbone.Model.extend({
    initialize: function (options) {
        this.options = options;
    },
    url: function () {
        return "/" + this.options.type + "/" + this.options.stateName + "?tm=" + new Date().getTime();
    }
});