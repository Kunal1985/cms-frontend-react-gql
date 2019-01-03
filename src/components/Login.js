import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { AUTH_TOKEN } from '../constants'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: true, // switch between Login and SignUp
      error: false,
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      dateOfBirth: 123
    }
  }

  render() {
    return (
      <div>
        <h4 className="mv3">{this.state.login ? 'Login' : 'Sign Up'}</h4>
        {!this.state.login && (
          <div className="flex flex-column">
            <input
              value={this.state.firstName}
              onChange={e => this.setState({ firstName: e.target.value })}
              type="text"
              placeholder="Enter First Name"
            />
            <input
              value={this.state.lastName}
              onChange={e => this.setState({ lastName: e.target.value })}
              type="text"
              placeholder="Enter Last Name"
            />
            <input
              value={this.state.dateOfBirth}
              onChange={e => this.setState({ dateOfBirth: e.target.value })}
              type="number"
              placeholder="Enter Date of Birth"
            />
          </div>
        )}
        <div className="flex flex-column">
          <input
            value={this.state.username}
            onChange={e => this.setState({ username: e.target.value })}
            type="text"
            placeholder="Enter username"
          />
          <input
            value={this.state.password}
            onChange={e => this.setState({ password: e.target.value })}
            type="password"
            placeholder="Choose a safe password"
          />
          {this.state.errorMessage ? (
            <div className="alert alert-danger div-margin-10">
              {this.state.errorMessage}
            </div>
          ) : ""}
        </div>
        <div className="flex mt3">
          <div className="pointer mr2 button" onClick={() => this._confirm()}>
            {this.state.login ? 'login' : 'create account'}
          </div>
          <div
            className="pointer button"
            onClick={() => this.setState({ login: !this.state.login })}
          >
            {this.state.login
              ? 'need to create an account?'
              : 'already have an account?'}
          </div>
        </div>
      </div>
    )
  }

  _confirm = async () => {
    let thisVar = this;
    const { username, password, firstName, lastName, dateOfBirth } = this.state
    if (this.state.login) {
      let credentials = {
          "username": username,
          "password": password
      }
      this.props.loginMutation({
        variables: {
          credentials
        },
      }).then(function(loginResult){
        const responseData = loginResult.data.login
        thisVar._saveUserData(responseData)
      }).catch(function(err){
        thisVar.setState({error: true});
        thisVar.setState({errorMessage: err.message})
      })
    } else {
      let userDetails = {
        "username": username,
        "password": password,
        "firstName": firstName,
        "lastName": lastName,
        "dateOfBirth": dateOfBirth
      }
      this.props.signupMutation({
        variables: {
          userDetails
        },
      }).then(function(signupResult){
        const responseData = signupResult.data.signUp
        thisVar._saveUserData(responseData)
      }).catch(function(err){
        thisVar.setState({error: true});
        thisVar.setState({errorMessage: err.message})
      })
    }
  }

  _saveUserData = responseData => {
    if(!responseData.token){
      this.setState({error: true});
      this.setState({errorMessage: [responseData.errorCode, responseData.errorMessage].join(": ")})
    } else{      
      this.setState({error: false});
      localStorage.setItem(AUTH_TOKEN, responseData.token)
      this.props.history.push(`/`)
    }
  }
}

const SIGNUP_MUTATION = gql`
  mutation signupMutation($userDetails: UserDTO!) {
    signUp(userDetails: $userDetails){
      token
      errorCode
      errorMessage
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation loginMutation($credentials: LoginDTO!) {
    login(credentials: $credentials){
      token
      errorCode
      errorMessage
    }
  }
`

export default compose(
  graphql(SIGNUP_MUTATION, { name: 'signupMutation' }),
  graphql(LOGIN_MUTATION, { name: 'loginMutation' }),
)(Login)