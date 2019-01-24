import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

class CreateAssetValue extends Component {
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
    const { fieldMapList, currAssetType } = this.state;
    let thisVar = this;
    let assetValueDTO = {
      type: currAssetType.type,
      fieldValues: fieldMapList
    }
    this.props.upsertAssetValue({
      variables: {
        assetValueDTO
      },
    }).then((upsertAssetValueResult) => {
      thisVar.props.parent.props.findAssetValuesByType.refetch();
      this.setState({ fieldMapList: [] })
    }).catch((err) => {
      console.log(err.message);
    })  
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
    if(currAssetType.type !== this.state.currAssetType.type){
      this.setState({
        currAssetType: currAssetType,
        fieldMapList: []
      });
    }
    let fieldMapList = this.state.fieldMapList;
    fieldMapList.length === 0 && currAssetType.fields && currAssetType.fields.map((field, index) => {
      fieldMapList.push(
        {
          key: field.name,
          value: ''
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

    return (
      <div className="panel panel-default">
        <div className="panel-heading"><strong>New asset of type '{currAssetType.type}'</strong></div>
        <div className="panel-body">
          {fieldMapList.map((field, index) => 
            <div className="row row-padding-10" key={field.key}>
              <div className="col col-sm-10">
                <div className="row">
                  <div className="col col-sm-6">{field.key}</div>
                  <div className="col col-sm-6">
                    <input className="form-control" 
                      value={field.value}
                      onChange={e => this.handleFieldChange(e, index)}
                      type="text"
                      placeholder={"Enter " + field.key}
                    />
                  </div>
                </div>
              </div>
            </div>  
          )}          
          <button className="btn btn-primary btn-margin-10" onClick={() => this.createAssetValue()}>
            Add
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
)(CreateAssetValue);