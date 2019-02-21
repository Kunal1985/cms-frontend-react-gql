import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Asset from './MainView';
import CreateAsset from './CreateView';

class AssetList extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  async refetchResults() {
    const { data } = await this.props.allAssetsQuery.refetch();
    let selectedAsset = this.state.selectedAsset;
    if (selectedAsset) {
      this.handleAssetTypeChanged(selectedAsset.type, data.findAllAssets);
    }
  }

  handleAssetTypeChanged(assetType, assetTypeList) {
    for (let i = 0; i < assetTypeList.length; i++) {
      let currAsset = assetTypeList[i];
      if (currAsset.type === assetType) {
        this.setState({ selectedAsset: currAsset })
      }
    }
  }

  render() {
    const accessToken = localStorage.getItem("auth-token");
    if (!accessToken) {
      return <div>UnAuthorized Access, please login!</div>
    }

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
    let selectedAsset = this.state.selectedAsset;
    return (
      <div>
        <CreateAsset parent={this} />
        <div className="panel panel-default">
          <div className="panel-heading"><strong>Asset Definition</strong></div>
          <div className="panel-body">
            <div className="row-padding-20">
              <select className="form-control" onChange={e => this.handleAssetTypeChanged(e.target.value, assetsToRender)} value={this.state.dataType}>
                <option value="">Select an Asset Type to proceed...</option>
                {assetsToRender.map(asset => <option key={asset.type} value={asset.type}>{asset.type}</option>)}
              </select>
            </div>
            {selectedAsset && (<Asset key={selectedAsset.type} asset={selectedAsset} parent={this} />)}
          </div>
        </div>
      </div>
    )
  }
}

const ALL_ASSETS_QUERY = gql`
  # 2
  query allAssetsQuery {
    findAllAssets{
      type
      fields{
        id
        name
        dataType
        optional
        isMulti
        multiType
        isAssetRef
      }    
    }
  }
`

// 3
export default graphql(ALL_ASSETS_QUERY, { name: 'allAssetsQuery' })(AssetList)