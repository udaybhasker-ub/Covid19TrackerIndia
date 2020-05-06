import Marionette from 'backbone.marionette';
import barChartTemplate from './BarChart.view.jst'
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.plugins.unregister(ChartDataLabels);

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
            plugins: {
                datalabels: {
                    color: 'white',
                    font: {
                        size: 10,
                    },
                    formatter: Math.round
                },
                labels: false
            },
            scales: {
                xAxes: [{
                    /*ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 90
                    }*/
                    stacked: true
                }],
                yAxes: [{
                    stacked: true
                }]
            },
            legend: {
                display: false
            },
            showTooltips: false,
        };
        const isMobile = $(document).width() < 800;
        const $canvas = this.$el.find('#' + data.id + "_barchart_canvas");
        let type;
        if (isMobile) {
            type = 'bar';
            data.options.aspectRatio = 1;
            defaults.plugins.datalabels = false;
        } else type = 'horizontalBar';

        const chart = new Chart($canvas, {
            type, data: data.data, options: { ...defaults, ...data.options },
            plugins: [ChartDataLabels]
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