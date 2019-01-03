import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { DATA_TYPES } from '../../../constants'

class CreateField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assetId: props.assetType,
      name: '',
      dataType: '',
      optional: false,
      isMulti: false,
      multiType: '',
      isAssetRef: false
    }
    this.handleIsMultiChange = this.handleIsMultiChange.bind(this);
    this.handleDataTypeChange = this.handleDataTypeChange.bind(this);
  }

  handleIsMultiChange(e){
    this.setState({ isMulti: e.target.checked });
    if(this.state.isMulti)
      this.setState({ multiType: '' })
  }

  handleDataTypeChange(e){
    let selectedValue = e.target.value;
    this.setState({ dataType: selectedValue });
    if(DATA_TYPES.indexOf(selectedValue) === -1){
      this.setState({ isAssetRef: true });
    } else{
      this.setState({ isAssetRef: false });
    }
  }

  render() {
    const allAssetsQuery = this.props.allAssetsQuery;
    // 1
    if (allAssetsQuery && allAssetsQuery.loading) {
      return <div>Loading</div>
    }

    // 2
    if (allAssetsQuery && allAssetsQuery.error) {
      return <div>{allAssetsQuery.error.message}!</div>
    }

    // 3
    const assetsToRender = allAssetsQuery.findAllAssets

    return (
      <div>
        <div className="row row-padding-10">
          <div className="col col-sm-10">
            <div className="row">
              <div className="col col-sm-2">
                <input className="form-control" 
                  value={this.state.name}
                  onChange={e => this.setState({ name: e.target.value })}
                  type="text"
                  placeholder="Enter Field Name"
                />
              </div>
              <div className="col col-sm-2">
                <select className="form-control" onChange={e => this.handleDataTypeChange(e)} value={this.state.dataType}>
                  <option value="">Select Data-Type</option>
                  {DATA_TYPES.map(dataType => <option key={dataType} value={dataType}>{dataType}</option>)}
                  {assetsToRender.map(asset => <option key={asset.type} value={asset.type}>{asset.type}</option>)}
                </select>
              </div>
              <div className="col col-sm-2">
                <input
                  value={this.state.optional}
                  onChange={e => this.setState({ optional: e.target.checked })}
                  type="checkbox"
                />
              </div>
              <div className="col col-sm-2">
                <input
                  value={this.state.isMulti}
                  onChange={e => this.handleIsMultiChange(e) }
                  type="checkbox"
                />
              </div>
              <div className="col col-sm-2">
                {this.state.isMulti ? (
                  <select className="form-control" onChange={e => this.setState({ multiType: e.target.value })} value={this.state.multiType}>
                    <option value="">Select Multi-Type</option>
                    <option value="List">List</option>
                    <option value="Set">Set</option>
                    <option value="Map">Map</option>
                  </select>
                ) : "NA"}
              </div>
              <div className="col col-sm-2">
                {this.state.isAssetRef ? "Y":"N"}
              </div>
            </div>
          </div>        
          <div className="col col-sm-2">
            <div className="row">
              <button className="btn btn-primary btn-margin-10" onClick={() => this.createField()}>
                Add
              </button>
              <button className="btn btn-default btn-margin-10" onClick={() => this.resetField()}>
                Reset
              </button>
            </div>
          </div>
        </div>        
        {this.state.errorMessage ? (
            <div className="alert alert-danger div-margin-10">
              {this.state.errorMessage}
            </div>
          ) : ""}
      </div>
    )
  }

  resetField = () => {
    this.setState({
      name: '',
      dataType: '',
      optional: false,
      isMulti: false,
      multiType: '',
      isAssetRef: false,
      errorMessage: null
    });
  }

  createField = async () => {
    let thisVar = this;
    const { name, dataType, optional, isMulti, multiType, isAssetRef, assetId } = this.state;
    let fieldDTO = {
      "name": name,
      "dataType": dataType,
      "optional": optional,
      "isMulti": isMulti,
      "multiType": multiType,
      "isAssetRef": isAssetRef,
      assetId: assetId
    }
    this.props.newField({
      variables: {
        fieldDTO
      },
    }).then((newFieldResult) => {
      let assetView = thisVar.props.parent;
      let assetListView = assetView.props.parent;
      assetListView.refetchResults();
      thisVar.resetField();
    }).catch((err) => {
      thisVar.setState({errorMessage: err.message})
    })  
  }
}

const NEW_FIELD_MUTATION = gql`
  mutation newField($fieldDTO: FieldDTO!){
    newField(fieldDTO: $fieldDTO){
      name
      dataType
      optional
      isMulti
      multiType
      isAssetRef
      assetId
    }
  }
`

const ALL_ASSETS_QUERY = gql`
  query allAssetsQuery {
    findAllAssets{
      type
    }
  }
`

export default compose(
  graphql(NEW_FIELD_MUTATION, { name: 'newField' }),
  graphql(ALL_ASSETS_QUERY, { name: 'allAssetsQuery' })
)(CreateField)