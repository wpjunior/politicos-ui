"use strict";

var LegislatorBox = React.createClass({
    displayName: "LegislatorBox",
    render: function render() {
        var legislator = this.props.legislator;
        var pathname = "/legislator/" + legislator.id;
        var state = { legislator: legislator };
        return React.createElement(
            "div",
            { className: "legislator-box" },
            React.createElement("img", { src: legislator.picture }),
            React.createElement(
                ReactRouter.Link,
                { to: { pathname: pathname, state: state } },
                React.createElement(
                    "b",
                    null,
                    this.props.legislator.name
                )
            )
        );
    }
});

var ListLegislator = React.createClass({
    displayName: "ListLegislator",
    getInitialState: function getInitialState() {
        return { loading: true, term: this.props.params.term, fetchedByTerm: null };
    },
    componentDidMount: function componentDidMount() {
        this.loadLegislator();
    },
    componentWillReceiveProps: function componentWillReceiveProps(newProps) {
        var _this = this;

        // to update state based on props change
        if (newProps.params.term === this.state.fetchedByTerm) {
            return;
        }

        this.setState({ term: newProps.params.term, loading: true }, function () {
            _this.loadLegislator();
        });
    },
    loadLegislator: function loadLegislator() {
        var _this2 = this;

        new API().getLegislators(this.state.term).then(function (response) {
            _this2.setState({
                loading: false,
                meta: response.meta,
                objects: response.objects,
                fetchedByTerm: _this2.props.params.term
            });
        }, function (error) {
            alert('Error in server');
        });
    },
    render: function render() {
        if (this.state.loading) {
            return React.createElement(
                "b",
                null,
                "Loading ..."
            );
        }

        var legislatorsElems = this.state.objects.map(function (legislator) {
            return React.createElement(LegislatorBox, { key: legislator.id, legislator: legislator });
        });

        return React.createElement(
            "div",
            { className: "legislator-list dropdown-menu" },
            legislatorsElems
        );
    }
});

var LegislatorDetail = React.createClass({
    displayName: "LegislatorDetail",
    getInitialState: function getInitialState() {
        return { loading: true, legislator: null };
    },
    componentDidMount: function componentDidMount() {
        this.loadLegislator();
    },
    loadLegislator: function loadLegislator() {
        var _this3 = this;

        new API().getLegislatorById(this.props.params.id).then(function (legislator) {
            _this3.setState({
                loading: false,
                legislator: legislator
            });
        }, function (error) {
            alert('Error in server');
        });
    },
    render: function render() {
        if (this.state.loading) {
            return React.createElement(
                "b",
                null,
                "Loading ..."
            );
        }

        var legislator = this.state.legislator;

        var alternativeNamesTag = null;
        var alternativeNames = legislator.alternative_names.map(function (n) {
            return n.name;
        }).join(', ');

        if (alternativeNames) {
            alternativeNamesTag = React.createElement(
                "p",
                null,
                "Nomes alternativos: ",
                alternativeNames
            );
        }

        return React.createElement(
            "div",
            { className: "legislator-detail" },
            React.createElement("img", { src: legislator.picture }),
            React.createElement(
                "h2",
                null,
                legislator.name
            ),
            React.createElement(
                "p",
                null,
                "Nacionalidade: ",
                legislator.nationality
            ),
            React.createElement(
                "p",
                null,
                "Ocupação: ",
                legislator.occupation
            ),
            alternativeNamesTag,
            React.createElement(
                "p",
                null,
                "Educação: ",
                legislator.education.name
            ),
            React.createElement(
                "p",
                null,
                "Cor/Raça: ",
                legislator.ethnicity.name
            ),
            React.createElement(
                "p",
                null,
                "Sexo: ",
                legislator.gender == 'M' ? 'Masculino' : 'Feminino'
            ),
            React.createElement(
                "p",
                null,
                "Estado civil: ",
                legislator.marital_status
            ),
            React.createElement(
                "p",
                null,
                "Estado: ",
                legislator.state
            ),
            React.createElement(
                "p",
                null,
                "Naturalidade: ",
                legislator.place_of_birth
            )
        );
    }
});

var Main = React.createClass({
    displayName: "Main",
    getInitialState: function getInitialState() {
        return { term: this.props.params.term || '' };
    },
    render: function render() {
        return React.createElement(
            "div",
            { className: "container" },
            React.createElement(
                "h1",
                null,
                "Olho neles - Políticos"
            ),
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-md-12" },
                    React.createElement(
                        "div",
                        { className: "input-group", id: "adv-search" },
                        React.createElement("input", { type: "input", className: "form-control url", placeholder: "Busque o seu político", onChange: this.changeTerm, onKeyUp: this.checkIsEnter, value: this.state.term }),
                        React.createElement(
                            "div",
                            { className: "input-group-btn" },
                            React.createElement(
                                "div",
                                { className: "dropdown dropdown-lg" },
                                React.createElement(
                                    "button",
                                    { type: "button", className: "btn btn-primary", onClick: this.findLegislator },
                                    React.createElement("span", { className: "glyphicon glyphicon-search", "aria-hidden": "true" })
                                )
                            )
                        )
                    )
                )
            ),
            this.props.children
        );
    },
    changeTerm: function changeTerm(e) {
        this.setState({ term: e.target.value });
    },
    checkIsEnter: function checkIsEnter(e) {
        if (e.keyCode == 13) {
            this.findLegislator();
        }
    },
    findLegislator: function findLegislator() {
        this.props.history.push('/search/' + this.state.term);
    }
});

ReactDOM.render(React.createElement(
    ReactRouter.Router,
    null,
    React.createElement(
        ReactRouter.Route,
        { path: "/", component: Main },
        React.createElement(ReactRouter.Route, { path: "search/:term", component: ListLegislator }),
        React.createElement(ReactRouter.Route, { path: "legislator/:id", component: LegislatorDetail })
    )
), document.getElementById('main'));