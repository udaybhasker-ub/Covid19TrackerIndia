import Marionette from 'backbone.marionette';
import mainTemplate from './MainView.view.jst';
import StateData from '../../Models/StateData.model';
import DistrictStats from '../../Models/DistrictStats.model';
import PieChart from '../PieChart/PieChart.view';
import LineChart from '../LineChart/LineChart.view';
import BarChart from '../BarChart/BarChart.view';
import PieChartCollectionView from '../PieChartCollection/PieChartCollection.view';
import DistrictZoneModel from '../../Models/DistrictZone.model';
import StatesData from '../../data/States.json';
import CountryData from '../../Models/CountryData.model';
import StatesDaily from '../../Models/StatesDaily.model';
import BadgeBarView from '../BadgeBar/BadgeBar.view';

export default Marionette.View.extend({
    template: mainTemplate,
    tagName: 'div',
    id: 'mainView',
    className: '',
    regions: {
        countryPieChartRegion: '#countryPieChartContainer',
        countryLineChartRegion: '#countryLineChartContainer',
        statePieChartRegion: '#statePieChartContainer',
        stateStatusBadgesRegion: "#stateStatusBadgesContainer",
        stateLineChartRegion: '#stateLineChartContainer',
        districtPieChartRegion: '#districtChartsContainer',
        topDistrictPieChartRegion: '#topDistrictChartsContainer',
    },
    initialize: function () {
        this.defaultSelections = {
            stateSelected: "Telangana",
            sortBySelected: "Confirmed Gain",
            sortByOrderDescending: false
        };
        this.stateSelected = this.defaultSelections.stateSelected;
        this.sortBySelected = this.defaultSelections.sortBySelected;
        this.sortByOrderDescending = this.defaultSelections.sortByOrderDescending;

        const defaults = {
            deaths: '',
            discharged: '',
            loc: this.stateSelected,
            totalConfirmed: ''
        };
        this.model = new Backbone.Model({ ...defaults });
        Backbone.Radio.channel('user').on('changeState', this.changeStateSelection.bind(this));
    },
    onRender: function () {
        const $ddMenu = this.$el.find('#stateSelectionDropdown > .dropdown-menu');
        Object.keys(StatesData).forEach((state) => {
            $ddMenu.append($('<a/>', {
                'class': 'dropdown-item',
                'href': '#'
            }).html(state));
        });
        this.getAllDistrictsData().then((allDistrictData) => {
            let stateInsights = {};
            Object.keys(allDistrictData).forEach(key => {
                const state = allDistrictData[key];
                const insight = {
                    code: state.statecode,
                    totalDistricts: Object.keys(state.districtData).length,
                    active: Object.values(state.districtData).reduce((total, obj) => { return total + obj.active }, 0),
                    confirmed: Object.values(state.districtData).reduce((total, obj) => { return total + obj.confirmed }, 0),
                    deceased: Object.values(state.districtData).reduce((total, obj) => { return total + obj.deceased }, 0),
                    recovered: Object.values(state.districtData).reduce((total, obj) => { return total + obj.recovered }, 0),
                    delta: {
                        confirmed: Object.values(state.districtData).reduce((total, obj) => { return total + obj.delta.confirmed }, 0),
                        deceased: Object.values(state.districtData).reduce((total, obj) => { return total + obj.delta.deceased }, 0),
                        recovered: Object.values(state.districtData).reduce((total, obj) => { return total + obj.delta.recovered }, 0),
                    }
                };
                stateInsights[key] = insight;
            });
            console.dir(stateInsights);
        });
        this.showCountryPieChart().then(result => {
            this.showCountryBarChart(result);
        });
        //this.showCountryLineChart();

        this.loadChildViews();
    },
    events: {
        'click #stateSelectionDropdown a.dropdown-item': 'onStateSelectionChange',
        'click #sortByDropdown a.dropdown-item': 'onSortBySelectionChange',
        'click #topDistrictSortByDropdown a.dropdown-item': 'onTopDistrictsCriteriaChange',
        'click #sortOrderBtn': 'onSortOrderSelectionChange',
        'click #topDistrictsBtn': 'showTopDistricts'
    },
    onTopDistrictsCriteriaChange: function (e) {
        e.preventDefault();
        this.sortBySelected = $(e.target).html();
        this.getTopDistricts($(e.target).html(), this.defaultSelections.sortByOrderDescending);
    },
    showTopDistricts: function (e) {
        e.preventDefault();
        this.$el.find('#stateContentMain').hide();
        this.getTopDistricts(this.defaultSelections.sortBySelected, this.defaultSelections.sortByOrderDescending);
    },
    onStateSelectionChange: function (e) {
        e.preventDefault();
        this.changeStateSelection($(e.target).html());
    },
    onSortBySelectionChange: function (e) {
        e.preventDefault();
        this.sortBySelected = $(e.target).html();
        this.getStateDistricts();
    },
    onSortOrderSelectionChange: function (e) {
        e.preventDefault();
        this.sortByOrderDescending = !this.sortByOrderDescending;
        this.getStateDistricts();
    },
    changeStateSelection: function (state) {
        if (state == "Telengana") state = "Telangana";
        this.stateSelected = state;
        this.sortBySelected = this.defaultSelections.sortBySelected;
        this.sortByOrderDescending = this.defaultSelections.sortByOrderDescending;
        this.$el.find('#dropdownMenuButton').html(this.stateSelected);
        //this.resetChildViews();
        this.loadChildViews();
    },
    resetChildViews: function () {
        this.getChildView('districtPieChartRegion').destroy();
        this.getChildView('statePieChartRegion').destroy();
        this.getChildView('stateLineChartRegion').destroy();
    },
    loadChildViews: function () {
        this.$el.find('#stateContentMain').show();
        this.$el.find('#topDistrictContainer').hide();
        this.$el.find('#topDistrictsBtn').removeClass('active');
        this.$el.find('#dropdownMenuButton').addClass('active');

        this.showChildView('districtPieChartRegion', new PieChartCollectionView({ id: this.stateSelected }));
        this.getStateDistricts().then(districts => {
            const data = {
                totalConfirmed: districts.reduce(function (tot, arr) { return tot + arr.district.confirmed; }, 0),
                deaths: districts.reduce(function (tot, arr) { return tot + arr.district.deceased; }, 0),
                discharged: districts.reduce(function (tot, arr) { return tot + arr.district.recovered; }, 0),
                delta: {
                    confirmed: districts.reduce(function (tot, arr) { return tot + arr.district.delta.confirmed; }, 0),
                    deceased: districts.reduce(function (tot, arr) { return tot + arr.district.delta.deceased; }, 0),
                    recovered: districts.reduce(function (tot, arr) { return tot + arr.district.delta.recovered; }, 0),
                }
            }
            const district = {
                confirmed: data.totalConfirmed,
                active: data.totalConfirmed - data.deaths - data.discharged,
                deceased: data.deaths,
                recovered: data.discharged,
                delta: data.delta
            };
            const statePieStart = new PieChart({
                id: 'pieChartContainer',
                "className": 'pie-chart',
                district,
                options: {
                    title: {
                        display: false,
                        text: this.stateSelected,
                        fontSize: 20
                    },
                    legend: {
                        display: false
                    },
                    onClick: function (e) {
                        console.log(e);
                    },
                    hideBadgeBar: true
                },
            });
            this.$el.find('#statePieChartName').html(this.stateSelected);
            this.showChildView('stateStatusBadgesRegion', new BadgeBarView({ district }));
            this.showChildView('statePieChartRegion', statePieStart);
        });

        const historyModel = new StateData({ type: 'history', stateName: this.stateSelected });
        historyModel.fetch().then(this.drawStateLineChart.bind(this));
    },
    showCountryPieChart: function () {
        let latestCountry = new CountryData({ type: 'latest' });
        return latestCountry.fetch().then((result) => {
            console.log(result);
            const summary = result['unofficial-summary'][0];
            const countryPieStart = new PieChart({
                id: 'pieChartContainer',
                "className": 'country-pie-chart',
                district: {
                    confirmed: summary.total,
                    active: summary.active,
                    deceased: summary.deaths,
                    recovered: summary.recovered
                },
                options: {
                    title: {
                        display: true,
                        text: 'India',
                        fontSize: 20
                    },
                    legend: {
                        display: false
                    }
                },
            });
            this.showChildView('countryPieChartRegion', countryPieStart);
            return result;
        });
    },
    showCountryLineChart: function () {
        let statesDaily = new StatesDaily();
        statesDaily.fetch().then((result) => {
            result = result['states_daily'];
            let timeline = result.filter(a => a.status == 'Confirmed').map(d => d.date);
            console.log(result);
            let datasets = [];
            Object.keys(StatesData).forEach(state => {
                datasets.push({
                    label: state,
                    data: result.filter(a => a.status == 'Confirmed').map(d => d[StatesData[state]]).sort((a, b) => { return a - b }),
                    borderWidth: 2,
                    pointRadius: 2,
                    fill: false,
                    showLine: true,
                });
            });
            const data = {
                datasets,
                labels: timeline,
            };
            const countryLineChart = new LineChart({
                id: 'lineChartContainer',
                "className": 'state-line-chart',
                data,
                options: {
                    legend: {
                        display: false
                    }
                },
                yAxesUpperLimit: 10000
            });
            this.showChildView('countryLineChartRegion', countryLineChart);
        });
    },
    showCountryBarChart: function (result) {
        result = result.regional;
        console.log(result);
        result.sort((a, b) => { return b.totalConfirmed - a.totalConfirmed });
        result = result.splice(0, 10);
        const data = {
            datasets: [{
                label: "Recovered",
                data: result.map(a => a.discharged),
                backgroundColor: 'rgba(60, 174, 163, 0.8)',
                hoverBackgroundColor: 'rgba(60, 174, 163, 1)',
                datalabels: {
                    align: 'right',
                    anchor: 'start'
                }
            },{
                label: "Deaths",
                data: result.map(a => a.deaths),
                backgroundColor: 'rgba(237, 85, 59, 0.8)',
                hoverBackgroundColor: 'rgba(237, 85, 59, 1)',
                datalabels: {
                    align: 'center',
                    anchor: 'center'
                }
            },{
                label: "Active",
                data: result.map(a => a.totalConfirmed - a.discharged - a.deaths),
                backgroundColor: 'rgba(32, 99, 155, 0.8)',
                hoverBackgroundColor: 'rgba(32, 99, 155, 1)',
                datalabels: {
                    align: 'left',
                    anchor: 'end'
                }
            },],
            labels: result.map(a => a.loc),
        };
        const countryBarChart = new BarChart({
            id: 'barChartContainer',
            "className": 'state-bar-chart',
            data, options: {
                title: {
                    display: true,
                    text: 'Top 10 States (Click to load state)'
                },
            }
        });
        this.showChildView('countryLineChartRegion', countryBarChart);
    },
    drawStateLineChart: function (result) {
        let timeline = result.map(a => a.day);

        const data = {
            datasets: [{
                label: 'Confirmed Cases',
                data: result.map(a => a.data.totalConfirmed),
                pointRadius: 0,
                borderColor: '#20639B',
                fill: false,
                showLine: true,
            },
            {
                label: 'Recovered',
                data: result.map(a => a.data.discharged),
                pointRadius: 0,
                borderColor: '#3CAEA3',
                fill: false,
                showLine: true
            },
            {
                label: 'Deceased',
                data: result.map(a => a.data.deaths),
                pointRadius: 0,
                borderColor: '#ED553B',
                fill: false,
                showLine: true
            }],
            labels: timeline,
        };
        const stateLineChart = new LineChart({
            id: 'lineChartContainer',
            "className": 'state-line-chart',
            data,
            yAxesUpperLimit: Math.max(...result.map(a => a.data.totalConfirmed))
        });
        this.showChildView('stateLineChartRegion', stateLineChart);
    },
    checkExpired: function (date) {
        const EXPIRE_DURATION = 5 * 60 * 1000;
        date = new Date(date.getTime() + EXPIRE_DURATION);
        return date.getTime() < new Date().getTime();
    },
    getAllDistrictsData: function () {
        let loaded;
        if (this.allDistrictData && this.allDistrictData.result && !this.checkExpired(this.allDistrictData.lastUpdated)) {
            loaded = Promise.resolve(this.allDistrictData.result);
        } else {
            const opts = { stateName: "all" };
            loaded = new DistrictStats(opts).fetch().then((districtStatsResults) => {
                return new DistrictZoneModel(opts).fetch().then((districtZoneResults) => {
                    let countryZoneStats = {
                        Red: 0,
                        Orange: 0,
                        Green: 0
                    }
                    districtZoneResults.zones.forEach((zone) => {
                        Object.values(districtStatsResults).forEach((stateDistricts) => {
                            const d = stateDistricts.districtData[zone.district];
                            if (d) d.zone = { zone: zone.zone, lastupdated: zone.lastupdated };
                            if (zone.zone) countryZoneStats[zone.zone]++;
                        });
                    });
                    this.allDistrictData = { lastUpdated: new Date(), result: districtStatsResults };
                    return this.allDistrictData.result;
                });
            });
        }
        return loaded;
    },
    getTopDistricts: function (criteria, orderDesc) {
        this.$el.find('#stateContentMain').hide();
        this.$el.find('#topDistrictContainer').show();
        this.$el.find('#topDistrictsBtn').addClass('active');
        this.$el.find('#dropdownMenuButton').removeClass('active');

        this.showChildView('topDistrictPieChartRegion', new PieChartCollectionView({ id: 'topDistricts' }));
        return this.getAllDistrictsData().then(allDistrictData => {
            let allDistricts = [], result = {};
            Object.keys(allDistrictData).forEach((stateName) => {
                Object.keys(allDistrictData[stateName].districtData).forEach((districtName) => {
                    const d = allDistrictData[stateName].districtData[districtName];
                    d.name = districtName;
                    d.state = stateName;
                    allDistricts.push(d);
                });
            });

            allDistricts = this.sortDistricts(allDistricts, criteria, orderDesc);
            allDistricts = allDistricts.splice(0, 10);
            allDistricts.forEach(dist => { result[dist.name] = dist });
            return { districtData: result, showStateName: true }
        }).then(this.prepareDistrictData.bind(this)).then(({ districts, stateZoneStats }) => {
            this.getChildView('topDistrictPieChartRegion').collection.reset(districts);
            this.$el.find('#topDistrictSortByDropdown > button').html('Criteria: ' + criteria);
            return districts;
        });
    },
    getStateDistricts: function () {
        let stateName = this.stateSelected;
        return this.getAllDistrictsData().then(allDistrictData => {
            return allDistrictData[stateName];
        }).then(this.prepareDistrictData.bind(this)).then(({ districts, stateZoneStats }) => {
            this.getChildView('districtPieChartRegion').collection.reset(districts);
            Object.keys(stateZoneStats).forEach((key) => {
                const $badge = this.$el.find('.zone-badge-' + key);
                $badge.html(stateZoneStats[key]);
            });
            this.$el.find('#sortByDropdown > button').html('Sort by: ' + this.sortBySelected);
            this.$el.find('#sortOrderBtn > i.arrow').html("arrow_" + (this.sortByOrderDescending ? 'upward' : 'downward'));
            return districts;
        });
    },
    prepareDistrictData: function (result) {
        let stateName = this.stateSelected, sortBy = this.sortBySelected, sortByOrderDescending = this.sortByOrderDescending;
        return new Promise((resolve, rej) => {
            console.log(result);
            let districts = [], stateZoneStats = {
                Red: 0,
                Orange: 0,
                Green: 0
            };
            Object.keys(result.districtData).forEach((key) => {
                const district = result.districtData[key];
                const containerID = stateName.split(' ').join('-') + "_" + key.split(' ').join('-').split('.').join('-') + '_pieChart';
                districts.push({
                    id: containerID,
                    title: key,
                    "className": 'district-pie-chart',
                    district,
                    options: {
                        title: {
                            display: true,
                            text: key + (result.showStateName ? ' (' + district.state + ')' : ''),
                            fontSize: result.showStateName ? 13 : 17
                        },
                        legend: {
                            display: false
                        }
                    }
                });
                if (district.zone) stateZoneStats[district.zone.zone]++;
            });
            districts = this.sortDistricts(districts, sortBy, sortByOrderDescending);
            resolve({ districts, stateZoneStats });
        });
    },
    sortDistricts: function (districts, sortBy, sortByOrderDescending) {
        return districts.sort((a, b) => {
            if (a.district) {
                a = a.district, b = b.district;
            }
            const zones = { Red: 3, Orange: 2, Green: 1 };
            let flag;
            if (sortBy == 'Active') {
                flag = b.active - a.active;
            } else if (sortBy == 'Recovered') {
                flag = b.recovered - a.recovered;
            } else if (sortBy == 'Deaths') {
                flag = b.deceased - a.deceased;
            } else if (sortBy == 'Zone') {
                if (b.zone && a.zone) {
                    flag = zones[b.zone.zone] - zones[a.zone.zone];
                } else flag = b.active - a.active;
            } else if (sortBy == 'Confirmed Gain') {
                if (b.delta && a.delta) {
                    flag = b.delta.confirmed - a.delta.confirmed;
                }
                if (!flag) flag = b.confirmed - a.confirmed;
            } else if (sortBy == 'Recovered Gain') {
                if (b.delta && a.delta) {
                    flag = b.delta.recovered - a.delta.recovered;
                }
                if (!flag) flag = b.recovered - a.recovered;
            } else if (sortBy == 'Deaths Gain') {
                if (b.delta && a.delta) {
                    flag = b.delta.deceased - a.delta.deceased;
                }
                if (!flag) flag = b.deceased - a.deceased;
            } else {
                flag = b.confirmed - a.confirmed;
            }
            if (sortByOrderDescending) {
                if (Math.sign(flag) == 1) flag = -Math.abs(flag)
                else if (Math.sign(flag) < 0) flag = Math.abs(flag)
            }
            return flag;
        });
    }
});