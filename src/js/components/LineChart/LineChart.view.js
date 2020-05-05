import Marionette from 'backbone.marionette';
import lineChartTemplate from './LineChart.view.jst'
import Chart from 'chart.js';

export default Marionette.View.extend({
    template: lineChartTemplate,
    tagName: 'div',
    id: function () {
        return this.model.id + '_lineChartContainer';
    },
    initialize: function (options) {
        this.model = options.model || new Backbone.Model(options);
        this.className = this.model.get('className');
    },
    onRender: function () {
        this.loadLineChart();
    },
    loadLineChart: function () {
        const data = { ...this.model.attributes };
        this.$el.addClass(data.className);
        const defaults =  {
            bezierCurve: true,
            legend: {
                display: false
             },
             tooltips: {
                enabled: true
             },
            scales: {
                xAxes: [{
                    gridLines: {
                        display:false
                    },
                    ticks: {
                        display: false
                    }
                }],
                yAxes: [{
                    gridLines: {
                        display:false
                    },
                    type: 'logarithmic',
                    ticks: {
                        callback: function (value, index, values) {
                            if (value === 1000000) return "1M";
                            if (value === 100000) return "100K";
                            if (value === 10000) return "10K";
                            if (value === 1000) return "1K";
                            if (value === 100) return "100";
                            if (value === 10) return "10";
                            if (value === 0) return "0";
                            return null;
                        },
                        display: false
                    }
                }]
            }
        }
        return new Chart(this.$el.find('#' + data.id + "_linechart_canvas"), {
            type: 'line', data: data.data, options: { ...defaults, ...data.options }
        });
    }
});