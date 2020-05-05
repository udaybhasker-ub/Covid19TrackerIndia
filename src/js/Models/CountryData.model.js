import Backbone from 'backbone';

export default Backbone.Model.extend({
    initialize: function (options) {
        this.options = options;
    },
    url: function () {
        return "/" + this.options.type + "/all?tm=" + new Date().getTime();
    }
});