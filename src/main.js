var LegislatorBox = React.createClass({
    render() {
        var legislator = this.props.legislator;
        var pathname = `/legislator/${legislator.id}`;
        var state = {legislator: legislator};
        return (
            <div className="legislator-box">
                <img src={legislator.picture} />
                <ReactRouter.Link to={{pathname, state}} >
                    <b>{this.props.legislator.name}</b>
                </ReactRouter.Link>
            </div>
        );
    }
});

var ListLegislator = React.createClass({
    getInitialState() {
        return {loading: true, term: this.props.params.term, fetchedByTerm: null};
    },
    componentDidMount() {
        this.loadLegislator();
    },
    componentWillReceiveProps(newProps) {
        // to update state based on props change
        if (newProps.params.term === this.state.fetchedByTerm) {
            return;
        }

        this.setState({term: newProps.params.term, loading: true}, ()=> {
            this.loadLegislator();
        });
    },  
    loadLegislator() {
        new API().getLegislators(this.state.term)
            .then((response) => {
                this.setState({
                    loading: false,
                    meta: response.meta,
                    objects: response.objects,
                    fetchedByTerm: this.props.params.term
                });
            }, (error) => {
                alert('Error in server');
            });
    },
    render() {
        if (this.state.loading) {
            return <b>Loading ...</b>;
        }

        var legislatorsElems = this.state.objects.map((legislator) => {
            return <LegislatorBox key={legislator.id} legislator={legislator} />;
        });

        return <div className="legislator-list dropdown-menu">{legislatorsElems}</div>;
    }
});

var LegislatorDetail = React.createClass({
    getInitialState() {
        return {loading: true, legislator: null};
    },
    componentDidMount() {
        this.loadLegislator();
    },
    loadLegislator() {
        new API().getLegislatorById(this.props.params.id)
            .then((legislator) => {
                this.setState({
                    loading: false,
                    legislator: legislator
                });
            }, (error) => {
                alert('Error in server');
            });
    },
    render() {
        if (this.state.loading) {
            return <b>Loading ...</b>;
        }

        var legislator = this.state.legislator;

        var alternativeNamesTag = null;
        var alternativeNames = legislator.alternative_names.map(n => n.name).join(', ');

        if (alternativeNames) {
            alternativeNamesTag = (<p>Nomes alternativos: {alternativeNames}</p>);
        }
        
        return (
            <div className="legislator-detail">
                <img src={legislator.picture}/>
                <h2>{legislator.name}</h2>
                <p>Nacionalidade: {legislator.nationality}</p>
                <p>Ocupação: {legislator.occupation}</p>
                {alternativeNamesTag}
                <p>Educação: {legislator.education.name}</p>
                <p>Cor/Raça: {legislator.ethnicity.name}</p>
                <p>Sexo: {legislator.gender == 'M' ? 'Masculino' : 'Feminino'}</p>
                <p>Estado civil: {legislator.marital_status}</p>
                <p>Estado: {legislator.state}</p>
                <p>Naturalidade: {legislator.place_of_birth}</p>
            </div>
        );
    }
});

var Main = React.createClass({
    getInitialState() {
        return {term: this.props.params.term || ''};
    },
    render() {
        return (
            <div className="container">
              <h1>Olho neles - Políticos</h1>

              <div className="row">
		<div className="col-md-12">
                  <div className="input-group" id="adv-search">

                    <input type="input" className="form-control url" placeholder="Busque o seu político" onChange={this.changeTerm} onKeyUp={this.checkIsEnter} value={this.state.term}/>
                    
                    <div className="input-group-btn">
                      <div className="dropdown dropdown-lg">
                        <button type="button" className="btn btn-primary" onClick={this.findLegislator}><span className="glyphicon glyphicon-search" aria-hidden="true"></span></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {this.props.children}
            </div>
        );
    },
    changeTerm(e) {
        this.setState({term: e.target.value});
    },
    checkIsEnter(e) {
        if (e.keyCode == 13) {
            this.findLegislator();
        }
    },
    findLegislator() {
        this.props.history.push('/search/'+this.state.term);
    }
});

ReactDOM.render((
  <ReactRouter.Router>
     <ReactRouter.Route path="/" component={Main}>
        <ReactRouter.Route path="search/:term" component={ListLegislator} />
        <ReactRouter.Route path="legislator/:id" component={LegislatorDetail} />
     </ReactRouter.Route>
  </ReactRouter.Router>
), document.getElementById('main'));




  
