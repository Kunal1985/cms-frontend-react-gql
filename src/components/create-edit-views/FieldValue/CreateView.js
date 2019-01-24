import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

class CreateFieldValue extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>Field Value for {this.props.assetType}</div>
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
    options: () => ({
      variables: {
        assetType: this.state ? this.state.selectedAsset.type : ""
      }
    })
  })
)(CreateFieldValue);