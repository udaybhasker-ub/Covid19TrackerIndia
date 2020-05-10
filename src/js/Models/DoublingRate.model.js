import Backbone from 'backbone';

export default Backbone.Model.extend({
    url: function () {
       return "/latest/all/doublingrate?tm=" + new Date().getTime();
    }
});