var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
const ReactDOMServer = require('react-dom/server');

var SpotActions = require('../actions/SpotActions');
var EdInActions = require('../actions/EdInActions');
var SpotConstants = require('../constants/SpotConstants');

var SuspiciousGridMixin = {
    emptySetMessage: 'There is no data available for selected date',
    getInitialState: function () {
        return this.store.getData();
    },
    componentDidMount: function () {
        this.store.addChangeDataListener(this._onChange);
    },
    componentDidUpdate: function () {
        if (this.state.loading || this.state.data.length===0) return;

        $(ReactDOM.findDOMNode(this)).popover({
            trigger: 'hover',
            html: true,
            selector: '[data-toggle="popover"]'
        });
    },
    componentWillUnmount: function () {
        this.store.removeChangeDataListener(this._onChange);
    },
    _renderRepCell: function (keyPrefix, reps) {
        var keys, services, tooltipContent;

        keys = Object.keys(reps);
        if (keys.length===0) return '';

        services = keys.map(function (key, idx) {
            return (
                <p key={keyPrefix + '_service' + idx}>
                    <span key={keyPrefix + '_service' + idx + '_name'} className="text-uppercase">{key}: </span>
                    <span key={keyPrefix + '_service' + idx + '_rep'} className={'label label-' + reps[key].cssClass}>{reps[key].text}</span>
                </p>
            );
        });

        tooltipContent = ReactDOMServer.renderToStaticMarkup(
            <div>
                {services}
            </div>
        );

        return (
            <span key={keyPrefix + '_rep'} className="fa fa-lg fa-shield" data-container="body" data-toggle="popover"
                  data-placement="right" data-content={tooltipContent}>
            </span>
        );
    },
    // Event Hanlders
    _onChange: function () {
        var state;

        state = this.store.getData();

        this.setState(state);
    },
    _onClickRow: function (item) {
        this.selectItems(item);

        // Select elements on Network and Details view
        EdInActions.selectThreat(item);
        EdInActions.reloadDetails();
        SpotActions.toggleMode(SpotConstants.DETAILS_PANEL, SpotConstants.DETAILS_MODE);
    },
    _onMouseEnterRow: function (item) {
        EdInActions.highlightThreat(item);
    },
    _onMouseLeaveRow: function (item) {
        EdInActions.unhighlightThreat(item);
    }
};

module.exports = SuspiciousGridMixin;
