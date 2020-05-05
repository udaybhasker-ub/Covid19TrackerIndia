
import Marionette from 'backbone.marionette';
import Backbone from 'backbone';
import PieChartView from '../PieChart/PieChart.view';

export default Marionette.CollectionView.extend({
    className: 'pie-chart-collection d-flex',
    childView: PieChartView,
    collection: new Backbone.Collection(),
    initialize: function(options){
        this.id = options.id + '_pieChartCollection';
    },
});
