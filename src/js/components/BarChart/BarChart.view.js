import Marionette from 'backbone.marionette';
import barChartTemplate from './BarChart.view.jst'
import Chart from 'chart.js';

export default Marionette.View.extend({
    template: barChartTemplate,
    tagName: 'div',
    id: function () {
        return this.model.id + '_barChartContainer';
    },
    initialize: function (options) {
        this.model = options.model || new Backbone.Model(options);
        this.className = this.model.get('className');
    },
    onRender: function () {
        this.loadBarChart();
    },
    loadBarChart: function () {
        const data = { ...this.model.attributes };
        this.$el.addClass(data.className);
        const defaults = {
            scales: {
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 90
                    }
                }]
            },
            legend: {
                display: false
            },
            showTooltips: false,
            "hover": {
                "animationDuration": 0
            },
            "animation": {
                "duration": 1,
                "onComplete": function () {
                    var chartInstance = this.chart,
                        ctx = chartInstance.ctx;

                    ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';

                    this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.controller.getDatasetMeta(i);
                        meta.data.forEach(function (bar, index) {
                            var data = dataset.data[index];
                            ctx.fillText(data, bar._model.x, bar._model.y - 5);
                        });
                    });
                }
            },
        };
        const $canvas = this.$el.find('#' + data.id + "_barchart_canvas");
        const chart = new Chart($canvas, {
            type: 'horizontalBar', data: data.data, options: { ...defaults, ...data.options }
        });

        $canvas.on('click', (evt) => {
            const activePoint = chart.getElementAtEvent(evt)[0];
            const data = activePoint._chart.data;
            const datasetIndex = activePoint._index;
            const stateSelected = data.labels[datasetIndex];
            Backbone.Radio.channel('user').trigger('changeState', stateSelected);
        });
    }
});