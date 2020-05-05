import Marionette from 'backbone.marionette';
import pieChartTemplate from './PieChart.view.jst'
import Chart from 'chart.js';
import BadgeBarView from '../BadgeBar/BadgeBar.view';

export default Marionette.View.extend({
    template: pieChartTemplate,
    tagName: 'div',
    id: function () {
        return this.model.id + '_pieChartContainer';
    },
    regions: {
        badgesBarContainerRegion: '#badgesBarContainer',
    },
    initialize: function (options) {
        this.model = options.model || new Backbone.Model(options);
        this.className = this.model.get('className');
    },
    events: {
        'click button#getDistrictsBtn': 'getDistricts'
    },
    onRender: function () {
        this.loadPieChart();
        const district = this.model.get('district');
        if(!this.model.get('options').hideBadgeBar) this.showChildView('badgesBarContainerRegion', new BadgeBarView({ district }));

        if (district && district.zone) {
            const $zoneIndecator = this.$el.find('.chart-zone-indicator');
            $zoneIndecator.css('background-color', district.zone.zone);

            var dateParts = district.zone.lastupdated.split("/");
            const a = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]),
                b = new Date(),
                difference = this.getDateDiffInDays(a, b);
            //if (difference > 0) difference = '+' + difference;
            $zoneIndecator.html('Zone updated ' + difference + ' days ago');
        }
    },
    getDateDiffInDays: function (a, b) {
        const _MS_PER_DAY = 1000 * 60 * 60 * 24;
        const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    },
    loadPieChart: function () {
        const data = { ...this.model.attributes };
        this.$el.addClass(data.className);
        const chartData = {
            datasets: [{
                backgroundColor: ['#20639B', '#ED553B', '#3CAEA3'],
                data: [data.district.active, data.district.deceased, data.district.recovered]
            }],
            labels: [
                'Active',
                'Deceased',
                'Recovered'
            ],
        };
        var defaults = {
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        //get the concerned dataset
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        //calculate the total of this data set
                        var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                            return previousValue + currentValue;
                        });
                        //get the current items value
                        var currentValue = dataset.data[tooltipItem.index];
                        //calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
                        var percentage = Math.floor(((currentValue / total) * 100) + 0.5);

                        return percentage + "%";
                    }
                }
            }
        };
        return new Chart(this.$el.find('#' + data.id + "_canvas"), {
            type: 'pie',
            data: chartData,
            options: { ...defaults, ...data.options }
        });
    }
});