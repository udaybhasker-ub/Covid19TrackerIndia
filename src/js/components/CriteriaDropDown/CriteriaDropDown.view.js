import Marionette from 'backbone.marionette';
import CriteriaDropdownTemplate from './CriteriaDropDown.view.jst';

export default Marionette.View.extend({
    template: CriteriaDropdownTemplate,
    tagName: 'div',
    className: 'dropdown sort-by-dropdown',
    id: function(){
        return this.model.get('id');
    },
    initialize: function (options) {
        this.sortBySelected = options.defaultSortByOption;
        options.defaultSortOrderSelected = false;
        this.sortOrderSelected = options.defaultSortOrderSelected;

        this.defaultLabels = ['Confirmed', 'Confirmed - Daily Increase', 'Active', 'Recovered', 'Recovered - Daily Increase', 'Deaths', 'Deaths - Daily Increase', 'Zone'];
        this.model = new Backbone.Model(options);
    },
    events: {
        'click a.dropdown-item': 'onSortBySelectionChange',
        'click a.sort-order-btn': 'onSortOrderChangeBtnClick'
    },
    onSortBySelectionChange: function (e) {
        e.preventDefault();
        this.sortBySelected = $(e.target).html();
        this.sortOrderSelected = this.model.get('defaultSortOrderSelected');
        this.updateSortButtons();
        const cb = this.model.get('callback');
        if (cb) cb(this.sortBySelected, this.sortOrderSelected);
    },
    onSortOrderChangeBtnClick: function (e) {
        e.preventDefault();
        this.sortOrderSelected = !this.sortOrderSelected;
        this.updateSortButtons();
        const cb = this.model.get('callback');
        if (cb) cb(this.sortBySelected, this.sortOrderSelected);
    },
    onRender: function () {
        const labels = this.model.get('labels') || this.defaultLabels;
        labels.forEach(entry => {
            let option = $('<a/>', {
                'class': 'dropdown-item',
                href: '#'
            });
            option.html(entry);
            this.$el.find('.dropdown-menu').append(option);
        });
        const sortOrderDisabled = this.model.get('sortOrderDisabled');
        if (sortOrderDisabled) {
            this.$el.find('.sort-order-btn').hide();
        } 
        this.updateSortButtons();
    },
    updateSortButtons: function(){
        this.$el.find('.sort-by-selection-btn').html(this.model.get('label') + ': ' + this.sortBySelected);
        this.$el.find('.sort-order-btn').find('.arrow').html('arrow_' + (this.sortOrderSelected ? 'upward' : 'downward'));
    }
});