import React, { Component } from 'react';

class AssetValue extends Component {
  render() {
    const currAssetValue = this.props.assetValue;
    return (
      <div className="panel panel-default">
        <div className="panel-heading">{currAssetValue.type[currAssetValue.id]}</div>
        <div className="panel-body">
          {currAssetValue.fieldValues.map(fieldValue => 
            <div className="row row-padding-10" key={fieldValue.id}>
              <div className="col col-sm-10">
                <div className="row">
                  <div className="col col-sm-6">{fieldValue.key}</div>
                  <div className="col col-sm-6">{fieldValue.value}</div>
                </div>
              </div>
            </div>  
          )}
        </div>        
      </div>
    )
  }
}

export default AssetValue;