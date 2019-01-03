import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

class CreateAsset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: ''
    }
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading"><strong>Create Asset</strong></div>
        <div className="panel-body">
          {this.state.errorMessage ? (
            <div className="alert alert-danger div-margin-10">
              {this.state.errorMessage}
            </div>
          ) : ""}
          <div className="row">
            <div className="col-xs-6">
              <input
                className="form-control"
                value={this.state.type}
                onChange={e => this.setState({ type: e.target.value })}
                type="text"
                placeholder="Enter Asset Type"
              />
            </div>
            <div className="col-xs-6">
              <button className="btn btn-primary btn-margin-10" onClick={() => this.createAsset()}>
              Create New Asset
              </button>
            </div>
          </div>
        </div>        
      </div>
    )
  }

  createAsset = async () => {
    let thisVar = this;
    thisVar.setState({errorMessage: null})
    const { type } = this.state;
    if(type){
      let assetDTO = {
        "type": type,
      }
      this.props.newAsset({
        variables: {
          assetDTO
        },
      }).then(function(data){
        thisVar.props.parent.refetchResults();        
      })
      .catch(function(err){
        thisVar.setState({errorMessage: err.message})
      })
    }
  }
}

const NEW_ASSET_MUTATION = gql`
  mutation newAsset($assetDTO: AssetDTO!){
    newAsset(assetDTO: $assetDTO){
      type
      fields{
        id
        name
      }
    }
  }
`

export default compose(
  graphql(NEW_ASSET_MUTATION, { name: 'newAsset' })
)(CreateAsset)