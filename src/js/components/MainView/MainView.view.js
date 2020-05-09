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
import ZoneRestrictionsView from '../ZoneRestrictions/ZoneRestrictions.view';
import CriteriaDropDownView from '../CriteriaDropDown/CriteriaDropDown.view';

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
        zoneRestrictionsRegion: '#zoneRestrictionsContainer',
        stateListPieChartRegion: '#stateListPieChartContainer',
    },
    initialize: function () {
        this.defaultSelections = {
            stateSelected: "Telangana",
            sortBySelected: "Confirmed - Daily Increase",
            sortByOrderDescending: false
        };
        this.stateSelected = this.defaultSelections.stateSelected;

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
        this.hideAllTabContainers();

        this.showChildView('districtPieChartRegion', new PieChartCollectionView({ id: this.stateSelected }));
        this.showChildView('stateListPieChartRegion', new PieChartCollectionView({ id: 'India' }));
        this.showChildView('zoneRestrictionsRegion', new ZoneRestrictionsView());

        const $ddMenu = this.$el.find('#stateSelectionDropdown > .dropdown-menu');
        Object.keys(StatesData).forEach((state) => {
            $ddMenu.append($('<a/>', {
                'class': 'dropdown-item',
                'href': '#'
            }).html(state));
        });
        this.getAllDistrictsData().then(this.getStateInsights.bind(this)).then((statewiseData) => {
            this.showCountryBarChart(statewiseData);
            return {
                active: Object.values(statewiseData).reduce((total, obj) => { return total + obj.active }, 0),
                confirmed: Object.values(statewiseData).reduce((total, obj) => { return total + obj.confirmed }, 0),
                deceased: Object.values(statewiseData).reduce((total, obj) => { return total + obj.deceased }, 0),
                recovered: Object.values(statewiseData).reduce((total, obj) => { return total + obj.recovered }, 0),
                delta: {
                    confirmed: Object.values(statewiseData).reduce((total, obj) => { return total + obj.delta.confirmed }, 0),
                    deceased: Object.values(statewiseData).reduce((total, obj) => { return total + obj.delta.deceased }, 0),
                    recovered: Object.values(statewiseData).reduce((total, obj) => { return total + obj.delta.recovered }, 0),
                }
            }
        })
            .then(this.showCountryPieChart.bind(this))
            .then(() => {
                let $mainContainer = this.getChildView('stateListPieChartRegion').$el.parent();
                if (!$mainContainer.find('#stateListCriteriaDropDown').is(':visible')) {
                    $mainContainer.prepend(new CriteriaDropDownView({
                        id: 'stateListCriteriaDropDown',
                        label: 'Criteria',
                        defaultSortByOption: this.defaultSelections.sortBySelected,
                        sortOrderDisabled: false,
                        callback: (changedSortBy, changedSortOrder) => {
                            console.log('selection changed:' + changedSortBy);
                            this.getStateList(changedSortBy, changedSortOrder);
                        },
                    }).render().el);
                }
                this.getStateList(this.defaultSelections.sortBySelected, this.defaultSelections.sortByOrderDescending);
            });
    },
    getStateInsights: function (allDistrictData) {
        let stateInsights = {};
        Object.keys(allDistrictData).forEach(key => {
            const state = allDistrictData[key];
            const insight = {
                loc: key,
                totalDistricts: Object.keys(state.districtData).length,
                active: Object.values(state.districtData).reduce((total, obj) => { return total + obj.active }, 0),
                confirmed: Object.values(state.districtData).reduce((total, obj) => { return total + obj.confirmed }, 0),
                deceased: Object.values(state.districtData).reduce((total, obj) => { return total + obj.deceased }, 0),
                recovered: Object.values(state.districtData).reduce((total, obj) => { return total + obj.recovered }, 0),
                delta: {
                    confirmed: Object.values(state.districtData).reduce((total, obj) => { return total + obj.delta.confirmed }, 0),
                    deceased: Object.values(state.districtData).reduce((total, obj) => { return total + obj.delta.deceased }, 0),
                    recovered: Object.values(state.districtData).reduce((total, obj) => { return total + obj.delta.recovered }, 0),
                },
                zones: {
                    Red: Object.values(state.districtData).reduce((total, obj) => { return total + (obj.zone && obj.zone.zone == 'Red' ? 1 : 0)}, 0),
                    Orange: Object.values(state.districtData).reduce((total, obj) => { return total + (obj.zone && obj.zone.zone == 'Orange' ? 1 : 0)}, 0),
                    Green: Object.values(state.districtData).reduce((total, obj) => { return total + (obj.zone && obj.zone.zone == 'Green' ? 1 : 0)}, 0),
                }
            };
            stateInsights[key] = insight;
        });
        return stateInsights;
    },
    events: {
        'click #stateSelectionDropdown a.dropdown-item': 'onStateSelectionChange',
        'click #sortByDropdown a.dropdown-item': 'onSortBySelectionChange',
        'click #sortOrderBtn': 'onSortOrderSelectionChange',
        'click #topDistrictsBtn': 'showTopDistricts',
        'click #getStatesBtn': 'onStateListNavBtnClick'
    },
    onStateListNavBtnClick: function (e) {
        e.preventDefault();
        this.getStateList(this.defaultSelections.sortBySelected, this.defaultSelections.sortByOrderDescending);
    },
    getStateList: function (sortByOption, sortOrderDesc) {
        this.getAllDistrictsData()
            .then(this.getStateInsights.bind(this))
            .then((insights) => {
                return this.prepareStateData(insights, sortByOption, sortOrderDesc);
            })
            .then((statewiseData) => {
                this.hideAllTabContainers();
                this.$el.find('#stateListPieChartContainer').show();
                this.$el.find('#getStatesBtn').addClass('active');
                this.getChildView('stateListPieChartRegion').collection.reset(statewiseData);
            });

    },
    showTopDistricts: function (e) {
        e.preventDefault();
        this.getTopDistricts(this.defaultSelections.sortBySelected, this.defaultSelections.sortByOrderDescending);
    },
    onStateSelectionChange: function (e) {
        e.preventDefault();
        this.changeStateSelection($(e.target).html());
    },
    hideAllTabContainers: function () {
        /*this.getChildView('zoneRestrictionsRegion').el.hide();
        this.$el.find('#stateChartsMainContainer').hide();
        this.$el.find('#topDistrictMainContainer').hide();
        this.$el.find('#topDistrictMainContainer').hide();*/
        $('.tab-item-container').hide();
        $('#selectionNavBar').find('a').removeClass('active');
    },
    changeStateSelection: function (state) {
        if (state == "Telengana") state = "Telangana";
        this.stateSelected = state;
        this.$el.find('#dropdownMenuButton').html(this.stateSelected);
        //this.resetChildViews();
        this.loadStateCharts();
    },
    resetChildViews: function () {
        this.getChildView('districtPieChartRegion').destroy();
        this.getChildView('statePieChartRegion').destroy();
        this.getChildView('stateLineChartRegion').destroy();
    },
    loadStateCharts: function () {
        this.hideAllTabContainers();
        const $mainContainer = this.$el.find('#stateChartsMainContainer');
        $mainContainer.show();
        this.$el.find('#dropdownMenuButton').addClass('active');

        if (!this.$el.find('#stateDistrictsCriteriaDropDown').is(':visible')) {
            $mainContainer.find('.sortby-dropdown').append(new CriteriaDropDownView({
                id: 'stateDistrictsCriteriaDropDown',
                label: 'Sort By',
                defaultSortByOption: this.defaultSelections.sortBySelected,
                sortOrderDisabled: false,
                callback: (changedSortBy, changedSortOrder) => {
                    console.log('selection changed:' + changedSortBy);
                    this.loadStateDistrictCharts(changedSortBy, changedSortOrder);
                },
            }).render().el);
        }
        this.loadStateDistrictCharts()
            .then(this.showStatePieStart.bind(this))
            .then(this.prepareStateLineChartData.bind(this))
            .then(this.drawStateLineChart.bind(this))
            .catch((err) => {
                localStorage.removeItem(this.stateSelected + "_districtHistory");
                localStorage.removeItem('allDistrictsLatest');
            });
    },
    loadStateDistrictCharts: function (sortBySelected, sortByOrderDescending) {
        let stateName = this.stateSelected;
        sortBySelected = sortBySelected || this.defaultSelections.sortBySelected;
        sortByOrderDescending = sortByOrderDescending || this.defaultSelections.sortByOrderDescending;

        return this.getAllDistrictsData().then(allDistrictData => {
            let districtData = allDistrictData[stateName].districtData;
            return { districtData, showStateName: false };
        }).then(this.prepareDistrictData.bind(this))
            .then(({ districts, stateZoneStats }) => {
                districts = this.sortDistricts(districts, sortBySelected, sortByOrderDescending);
                this.getChildView('districtPieChartRegion').collection.reset(districts);
                Object.keys(stateZoneStats).forEach((key) => {
                    const $badge = this.$el.find('.zone-badge-' + key);
                    $badge.html(stateZoneStats[key]);
                });
                return districts;
            });
    },
    showStatePieStart: function (districts) {
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
                    customTitle: false,
                    text: this.stateSelected,
                    fontSize: 20
                },
                legend: {
                    display: false
                },
                hideBadgeBar: true
            },
        });
        this.$el.find('#statePieChartName').html(this.stateSelected);
        this.showChildView('stateStatusBadgesRegion', new BadgeBarView({ district }));
        this.showChildView('statePieChartRegion', statePieStart);
    },
    showCountryPieChart: function (result) {
        const countryPieStart = new PieChart({
            id: 'pieChartContainer',
            "className": 'country-pie-chart',
            district: result,
            options: {
                title: {
                    display: true,
                    customTitle: false,
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
    },
    showCountryLineChart: function () {
        let statesDaily = new StatesDaily();
        statesDaily.fetch().then((result) => {
            result = result['states_daily'];
            let timeline = result.filter(a => a.status == 'Confirmed').map(d => d.date);
            //console.log(result);
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
        result = Object.keys(result).sort((a, b) => {
            return result[b].confirmed - result[a].confirmed
        }).map(key => result[key]);
        result = result.splice(0, 10);
        const data = {
            datasets: [{
                label: "Recovered",
                data: result.map(a => a.recovered),
                backgroundColor: 'rgba(60, 174, 163, 0.8)',
                hoverBackgroundColor: 'rgba(60, 174, 163, 1)',
                datalabels: {
                    align: 'right',
                    anchor: 'start'
                }
            }, {
                label: "Deaths",
                data: result.map(a => a.deceased),
                backgroundColor: 'rgba(237, 85, 59, 0.8)',
                hoverBackgroundColor: 'rgba(237, 85, 59, 1)',
                datalabels: {
                    align: 'center',
                    anchor: 'center'
                }
            }, {
                label: "Active",
                data: result.map(a => a.confirmed - a.recovered - a.deceased),
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
        return result;
    },
    prepareStateLineChartData: function () {
        let loaded = {};
        let distHistory = localStorage.getItem(this.stateSelected + "_districtHistory");
        distHistory = distHistory ? JSON.parse(distHistory) : {};
        if (distHistory && distHistory.result && !this.checkExpired(distHistory.lastUpdated, 24 * 60 * 60 * 1000)) {
            loaded = Promise.resolve(distHistory.result);
        } else {
            loaded = new StateData({ type: 'history', stateName: this.stateSelected }).fetch().then((result) => {
                localStorage.setItem(this.stateSelected + "_districtHistory", JSON.stringify({
                    result: result,
                    lastUpdated: new Date()
                }));
                return result;
            });
        }
        return loaded;
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
    checkExpired: function (date, expireMillis) {
        date = new Date(new Date(date).getTime() + expireMillis);
        return date.getTime() < new Date().getTime();
    },
    getAllDistrictsData: function () {
        let loaded;
        let allDistrictData = localStorage.getItem('allDistrictsLatest');
        allDistrictData = allDistrictData ? JSON.parse(allDistrictData) : {};
        if (allDistrictData && allDistrictData.result && !this.checkExpired(allDistrictData.lastUpdated, 5 * 60 * 1000)) {
            loaded = Promise.resolve(allDistrictData.result);
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
                    localStorage.setItem("allDistrictsLatest", JSON.stringify({ lastUpdated: new Date(), result: districtStatsResults }));
                    return districtStatsResults;
                });
            });
        }
        return loaded;
    },
    getTopDistricts: function () {
        this.hideAllTabContainers();
        const $mainContainer = this.$el.find('#topDistrictMainContainer');
        $mainContainer.show();
        this.$el.find('#topDistrictsBtn').addClass('active');

        if (!this.$el.find('#topDistrictsCriteriaDropDown').is(':visible')) {
            $mainContainer.prepend(new CriteriaDropDownView({
                id: 'topDistrictsCriteriaDropDown',
                label: 'Criteria',
                defaultSortByOption: this.defaultSelections.sortBySelected,
                sortOrderDisabled: true,
                callback: (changedSortBy, changedSortOrder) => {
                    console.log('selection changed:' + changedSortBy);
                    this.renderTopDistricts(changedSortBy, changedSortOrder);
                },
            }).render().el);
            this.showChildView('topDistrictPieChartRegion', new PieChartCollectionView({ id: 'topDistricts' }));
        }

        return this.renderTopDistricts(this.defaultSelections.sortBySelected, this.defaultSelections.sortByOrderDescending);
    },
    renderTopDistricts: function (criteria, orderDesc) {
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
            return { districtData: result, showStateName: true };
        }).then(this.prepareDistrictData.bind(this)).then(({ districts, stateZoneStats }) => {
            this.getChildView('topDistrictPieChartRegion').collection.reset(districts);
            //this.$el.find('#topDistrictSortByDropdown > button').html('Criteria: ' + criteria);
            return districts;
        });
    },
    prepareDistrictData: function (result) {
        return new Promise((resolve, rej) => {
            let districts = [], stateZoneStats = {
                Red: 0,
                Orange: 0,
                Green: 0
            };
            Object.keys(result.districtData).forEach((key) => {
                const district = result.districtData[key];
                const containerID = (district.state ? district.state.split(' ').join('-') + "_" : '') + key.split(' ').join('-').split('.').join('-') + '_pieChart';
                districts.push({
                    id: containerID,
                    title: key,
                    "className": 'district-pie-chart',
                    district,
                    options: {
                        title: {
                            display: false,
                            customTitle: true,
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
            resolve({ districts, stateZoneStats });
        });
    },
    prepareStateData: function (result, sortBySelected, sortByOrderDescending) {
        return new Promise((resolve, rej) => {
            //console.log(result);
            let stateList = [];
            Object.keys(result).forEach((key) => {
                const state = result[key];
                const containerID = key.split(' ').join('-') + '_pieChart';
                stateList.push({
                    id: containerID,
                    title: key,
                    "className": 'district-pie-chart state-district-pie-chart',
                    district: state,
                    options: {
                        title: {
                            display: false,
                            customTitle: true,
                            text: key,
                            fontSize: 17
                        },
                        legend: {
                            display: false
                        }
                    }
                });
            });
            stateList = this.sortDistricts(stateList, sortBySelected, sortByOrderDescending);
            resolve(stateList);
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
            } else if (sortBy == 'Confirmed - Daily Increase') {
                if (b.delta && a.delta) {
                    flag = b.delta.confirmed - a.delta.confirmed;
                }
                if (!flag) flag = b.confirmed - a.confirmed;
            } else if (sortBy == 'Recovered - Daily Increase') {
                if (b.delta && a.delta) {
                    flag = b.delta.recovered - a.delta.recovered;
                }
                if (!flag) flag = b.recovered - a.recovered;
            } else if (sortBy == 'Deaths - Daily Increase') {
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