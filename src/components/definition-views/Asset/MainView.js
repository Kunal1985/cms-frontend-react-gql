import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import CreateField from '../Field/CreateView';

class Asset extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currAsset: props.asset,
      reorder: false
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps && prevProps.asset !== this.props.asset) {
      this.setState({
        currAsset: this.props.asset
      })
    }
  }

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
      thisVar.setState({ errorMessage: err.message })
    })
  }

  enableReorder() {
    this.setState({
      reorder: true
    });
  }

  saveFields() {
    this.setState({
      reorder: false
    });
  }

  onDrag = (event, index) => {
    event.preventDefault();
    this.draggedItem = this.state.currAsset.fields[index];
  }

  onDragOver = index => {
    const draggedOverItem = this.state.currAsset.fields[index];

    // if the item is dragged over itself, ignore
    if (this.draggedItem === draggedOverItem) {
      return;
    }

    // filter out the currently dragged item
    let changesAsset = this.state.currAsset;
    let items = changesAsset.fields.filter(item => item !== this.draggedItem);

    // add the dragged item after the dragged over item
    items.splice(index, 0, this.draggedItem);
    changesAsset.fields = items;
    this.setState({ currAsset: changesAsset });
  };

  render() {
    const currAsset = this.state.currAsset;
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

          <CreateField assetType={currAsset.type} parent={this} />

          {currAsset.fields.map((field, index) => (
            <div className="row row-padding-10 field-rows" key={currAsset.type + field.name}
              onDragOver={() => this.state.reorder ? this.onDragOver(index) : "return false"}>
              <div draggable={this.state.reorder ? true : false} onDrag={(event) => this.state.reorder ? this.onDrag(event, index) : "return false"} onDragEnd={this.state.reorder ? this.onDragEnd : "return false"}>
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
              </div></div>)
          )}
        </div>
        <div><button className="btn btn-primary btn-margin-10" onClick={() => this.enableReorder()}>
          Reorder
                  </button>
          <button className="btn btn-danger btn-margin-10" onClick={() => this.saveFields()}>
            Save
                  </button></div>
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