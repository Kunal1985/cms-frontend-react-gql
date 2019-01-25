import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

class CreateFieldValue extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleAssetTypeChanged = this.handleAssetTypeChanged.bind(this);
  }

  handleAssetTypeChanged(e) {
    let selectedAssetValue = e.target.value;
    this.setState({selectedAssetValue}); 
    this.props.parentAssetValue.handleAssetRefFieldChange(this.props.currIndex, selectedAssetValue);
  }

  render() {
    let assetType = this.props.assetType;
    let assetTypeValue = this.props.assetTypeValue;
    const findAssetValuesByType = this.props.findAssetValuesByType;
    // 1
    if (findAssetValuesByType && findAssetValuesByType.loading) {
      return <div>Loading</div>
    }
    // 2
    if (findAssetValuesByType && findAssetValuesByType.error) {
      return <div>{findAssetValuesByType.error.message}!</div>
    }
    // 3
    const assetValuesList = findAssetValuesByType.findAssetValuesByType
    return (
      <div>
        Field Value for {assetType}
        <select className="form-control" onChange={e => this.handleAssetTypeChanged(e)} value={assetTypeValue?assetTypeValue:""}>
          <option value="">Select an {assetType}...</option>
          {assetValuesList.map(asset => <option key={asset.id} value={asset.id}>{asset.fieldValues[0].value}</option>)}
        </select>
      </div>
    )
  }
}

const ASSETVALUES_BY_TYPE_QUERY = gql`
  query findAssetValuesByType($assetType: String!) {
    findAssetValuesByType(assetType: $assetType){
      id
      type
      fieldValues{
        key
        value
      }
    }
  }
`
export default compose(
  graphql(ASSETVALUES_BY_TYPE_QUERY, {
    name: 'findAssetValuesByType',
    options: (props) => ({
      variables: {
        assetType: props.assetType,
      }
    })
  })
)(CreateFieldValue);