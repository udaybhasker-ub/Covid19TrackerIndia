import Marionette from 'backbone.marionette';
import BadgeBarTemplate from './BadgeBar.view.jst'

export default Marionette.View.extend({
    template: BadgeBarTemplate,
    tagName: 'div',
    className: 'badge-bar-content d-flex flex-wrap',
    initialize: function (options) {
        this.model = new Backbone.Model(options);
    },
    onRender: function () {
        const district = this.model.get('district');
        if (district && district.delta) {
            Object.keys(district.delta).forEach(key => {
                const $status = this.$el.find('.status-badge.' + key)
                let val = district.delta[key];
                if (val > 0) {
                    $status.find('i.arrow').html('arrow_upward');
                } else if (val < 0) {
                    $status.find('i.arrow').html('arrow_downward');
                }
                if (val != 0) $status.find('.badge-status-delta-text').text(Math.abs(val));
            });
        }
    },
});