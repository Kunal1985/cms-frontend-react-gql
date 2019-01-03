import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import CreateField from '../Field/CreateView';

class Asset extends Component {

  editField = () => {
    console.log("Edit")
  }

  deleteField = (fieldId) => {
    let thisVar = this;
    this.props.deleteField({
      variables: {
        fieldId
      },
    }).then((deleteFieldResult) => {
      let assetListView = thisVar.props.parent;
      assetListView.refetchResults();
    }).catch((err) => {
      thisVar.setState({errorMessage: err.message})
    }) 
  }

  render() {
    const currAsset = this.props.asset;
    return (
      <div className="panel panel-default">
        <div className="panel-heading"><strong>{currAsset.type}</strong></div>
        <div className="panel-body">
          <div className="row row-padding-10">
            <div className="col col-sm-10">
              <div className="row">
                <div className="col col-sm-2 text-bold">Field Name</div>
                <div className="col col-sm-2 text-bold">Data-Type</div>
                <div className="col col-sm-2 text-bold">Optional</div>
                <div className="col col-sm-2 text-bold">isMulti</div>
                <div className="col col-sm-2 text-bold">Multi-Type</div>
                <div className="col col-sm-2 text-bold">isAssetRef</div>
              </div>
            </div>
            <div className="col col-sm-2 text-bold">
              Actions
            </div>
          </div>
          
          <CreateField assetType={currAsset.type} parent={this}/>

          {currAsset.fields.map(field => 
            <div className="row row-padding-10" key={currAsset.type + field.name}>
              <div className="col col-sm-10">
                <div className="row">
                  <div className="col col-sm-2">{field.name}</div>
                  <div className="col col-sm-2">{field.dataType}</div>
                  <div className="col col-sm-2">{field.optional ? "Y" : "N"}</div>
                  <div className="col col-sm-2">{field.isMulti ? "Y" : "N"}</div>
                  <div className="col col-sm-2">{field.multiType ? field.multiType : "NA"}</div>
                  <div className="col col-sm-2">{field.isAssetRef ? "Y" : "N"}</div>
                </div>
              </div>
              <div className="col col-sm-2">
                <button className="btn btn-primary btn-margin-10" onClick={() => this.editField()}>
                  Edit
                </button>
                <button className="btn btn-danger btn-margin-10" onClick={() => this.deleteField(field.id)}>
                  Delete
                </button>
              </div>
            </div>  
          )}
        </div>        
      </div>
    )
  }
}

const DELETE_FIELD_MUTATION = gql`
  mutation deleteField($fieldId: String!){
    deleteField(fieldId: $fieldId)
  }
`

export default compose(
  graphql(DELETE_FIELD_MUTATION, { name: 'deleteField' })
)(Asset);