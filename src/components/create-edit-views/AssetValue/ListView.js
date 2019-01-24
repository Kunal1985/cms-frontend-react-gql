import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import CreateAssetValue from './CreateView';
import EditAssetValue from './EditView';

class AssetValueList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleAssetTypeChanged = this.handleAssetTypeChanged.bind(this);
        this.handleAssetValueChanged = this.handleAssetValueChanged.bind(this);
        this.fetchDisplayName = this.fetchDisplayName.bind(this);
        this.createNewBtnClick = this.createNewBtnClick.bind(this);
    }

    createNewBtnClick(){
      this.setState({selectedAssetValue: null});
    }

    getClassName(assetValue){
      let selectedAssetValue = this.state.selectedAssetValue;
      let className = "list-group-item";
      if(selectedAssetValue && assetValue && selectedAssetValue.id === assetValue.id){
        className = className.concat(" active")
      } 
      return className;
    }

    handleAssetValueChanged(e, assetValue){
      e.preventDefault();
      this.setState({selectedAssetValue: assetValue});
    }

    fetchDisplayName(assetValue){
      let fieldValueList = assetValue.fieldValues;
      let fieldValue = fieldValueList && fieldValueList[0];
      return fieldValue && fieldValue.value;
    }

    async handleAssetTypeChanged(assetType, assetsToRender){
      if(assetType === ""){
        this.setState({selectedAsset: null})
      } else{
        for(let i=0; i<assetsToRender.length; i++){
          let currAsset = assetsToRender[i];
          if(currAsset.type === assetType){
            this.setState({selectedAsset: currAsset})
          }
        }
      }
      this.setState({selectedAssetValue: null});
      this.props.findAssetValuesByType.refetch({ assetType });
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
        const assetsToRender = allAssetsQuery.findAllAssets;
        const assetValuesList = this.props.findAssetValuesByType.findAssetValuesByType;
        const selectedAsset = this.state.selectedAsset;
        const selectedAssetValue = this.state.selectedAssetValue;
        
        return (
          <div>
            <div className="row-padding-20">
              <select className="form-control" onChange={e => this.handleAssetTypeChanged(e.target.value, assetsToRender)} value={this.state.dataType}>
                <option value="">Select an Asset Type to proceed...</option>
                {assetsToRender.map(asset => <option key={asset.type} value={asset.type}>{asset.type}</option>)}
              </select> 
            </div>
            <div className="wrapper">
              {selectedAsset && (
                <nav id="sidebar">
                  <div className="panel panel-default">
                    <div className="panel-heading">
                     {selectedAsset && <strong>'{selectedAsset.type}' List</strong>}
                    </div>
                    <div className="panel-body">
                      <button className="btn btn-primary btn-margin-10" onClick={() => this.createNewBtnClick()}>
                        Create New {selectedAsset && selectedAsset.type}
                      </button>
                      {assetValuesList && (assetValuesList.length>0) ? (
                        <div className="list-group row-padding-10">
                          {assetValuesList.map(assetValue => {return (
                            <a className={this.getClassName(assetValue)} key={assetValue.id} onClick={e => this.handleAssetValueChanged(e, assetValue)}>
                              {this.fetchDisplayName(assetValue)}
                            </a>
                          )} )}
                        </div>
                      ): <div className="row-padding-20">No Assets of type <strong>{selectedAsset.type}</strong> created yet!</div>}
                    </div>
                  </div>
                </nav>
              )}
              <div className="full-width">
                {selectedAssetValue ? 
                  <EditAssetValue assetType={selectedAssetValue} parent={this} />:
                  selectedAsset ? 
                  <CreateAssetValue assetType={selectedAsset} parent={this} /> :
                  ""  
                }
              </div>
            </div>
          </div>
        )
    }
}

const ALL_ASSETVALUES_QUERY = gql`
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

export default compose(
  graphql(ALL_ASSETVALUES_QUERY, { name: 'findAssetValuesByType', 
    options: () => ({
      variables: {
        assetType: this.state ? this.state.selectedAsset.type: ""
      }
    })
  }),
  graphql(ALL_ASSETS_QUERY, { name: 'allAssetsQuery' })
)(AssetValueList)