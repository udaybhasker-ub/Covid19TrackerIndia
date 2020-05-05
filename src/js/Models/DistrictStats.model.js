import Backbone from 'backbone';

export default Backbone.Model.extend({
    initialize: function (options) {
        this.options = options;
    },
    url: function () {
       return "/latest/" + this.options.stateName+ "/districts?tm=" + new Date().getTime();
    }
});