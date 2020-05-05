import Backbone from 'backbone';

export default Backbone.Model.extend({
    url: function () {
       return "/history/states/all?tm=" + new Date().getTime();
    }
});