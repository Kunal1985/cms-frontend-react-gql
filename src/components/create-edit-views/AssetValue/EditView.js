import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import CreateFieldValue from '../FieldValue/CreateView'

class EditAssetValue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldMapList: [],
      currAssetType: props.assetType
    };
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.createAssetValue = this.createAssetValue.bind(this);
  }

  createAssetValue() {
    let thisVar = this;
    const { fieldMapList, currAssetType } = thisVar.state;
    let assetValueDTO = {
      assetValueId: currAssetType.id,
      type: currAssetType.type,
      fieldValues: fieldMapList
    }
    this.props.upsertAssetValue({
      variables: {
        assetValueDTO
      },
    }).then((upsertAssetValueResult) => {
      thisVar.props.parent.props.findAssetValuesByType.refetch();
    }).catch((err) => {
      console.log(err.message);
    })  
  }

  handleAssetRefFieldChange(index, selectedValue){
    let fieldMapList = this.state.fieldMapList;
    fieldMapList[index].value = selectedValue;
    this.setState({ fieldMapList: fieldMapList });
  }

  handleFieldChange(e, index){
    let fieldMapList = this.state.fieldMapList;
    fieldMapList[index].value = e.target.value
    this.setState({ fieldMapList: fieldMapList });
  }

  componentDidUpdate(){
    console.log("componentDidUpdate", this.state)
  }

  componentDidMount(){
    console.log("componentDidMount")
  }
  
  render() {
    const currAssetType = this.props.assetType;
    if(!currAssetType){
      return ""
    }
    if(currAssetType.id !== this.state.currAssetType.id){
      this.setState({
        currAssetType: currAssetType,
        fieldMapList: []
      });
    }
    let fieldMapList = this.state.fieldMapList;
    fieldMapList.length === 0 && currAssetType.fields && currAssetType.fields.map((field, index) => {
      let fieldValue = currAssetType.fieldValues.find(function(item){return item.key === field.name});
      fieldMapList.push(
        {
          key: field.name,
          dataType: field.dataType,
          isAssetRef: field.isAssetRef,
          value: fieldValue ? fieldValue.value : null
        }
      )
      return field
    });

    if(fieldMapList.length === 0) {
      return (
        <div className="panel panel-default">
          <div className="panel-heading">ERROR trying to create '{currAssetType.type}'</div>
          <div className="panel-body">Please define fields to proceed! Click<Link to="/define" className="ml1 no-underline black">here</Link></div>
        </div>  
      )
    }

    let thisVar = this;
    return (
      <div className="panel panel-default">
        <div className="panel-heading"><strong>Asset of type '{currAssetType.type}'</strong></div>
        <div className="panel-body">
          {fieldMapList.map((field, index) => 
            <div className="row row-padding-10" key={field.key}>
              <div className="col col-sm-10">
                <div className="row">
                  <div className="col col-sm-6">{field.key}</div>
                  <div className="col col-sm-6">
                    {field.isAssetRef ? (
                      <CreateFieldValue assetTypeValue={field.value} assetType={field.dataType} parentAssetValue={thisVar} currIndex={index}/>
                    ): (
                      <input className="form-control" 
                        value={field.value}
                        onChange={e => this.handleFieldChange(e, index)}
                        type="text"
                        placeholder={"Enter " + field.key}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>  
          )}          
          <button className="btn btn-primary btn-margin-10" onClick={() => this.createAssetValue()}>
            Update
          </button>
        </div>        
      </div>
    )
  }
}

const NEW_ASSETVALUE_MUTATION = gql`
  mutation upsertAssetValue($assetValueDTO: AssetValueDTO!){
    upsertAssetValue(assetValueDTO: $assetValueDTO){
      type
      fieldValues{
        key
        value
      }
    }
  }
`
export default compose(
  graphql(NEW_ASSETVALUE_MUTATION, { name: 'upsertAssetValue' })
)(EditAssetValue);