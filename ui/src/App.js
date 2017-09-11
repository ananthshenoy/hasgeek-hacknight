import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom'
import { FacebookLogin } from 'react-facebook-login-component';
import Protected from "./Protected";

const FindYourBuddy = () => (
  <Router>
    <div>
      <AuthButton/>
      <ul>
        <li><Link to="/protected">Protected Page</Link></li>
      </ul>
      <Route path="/login" component={Login}/>
      <PrivateRoute path="/protected" component={Protected}/>
    </div>
  </Router>
)

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100) // fake async
  },
  signout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
}

const AuthButton = withRouter(({ history }) => (
  fakeAuth.isAuthenticated ? (
    <p>
      Welcome! <button onClick={() => {
        fakeAuth.signout(() => history.push('/'))
      }}>Sign out</button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  )
))

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    fakeAuth.isAuthenticated ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

class Login extends React.Component {
  state = {
    redirectToReferrer: false
  }

  login = (response) => {
    localStorage.setItem("access_token", response.accessToken);
    localStorage.setItem("name", response.name);
    fakeAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true })
    })
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { redirectToReferrer } = this.state
    
    if (redirectToReferrer) {
      return (
        <Redirect to={from}/>
      )
    }
    
    return (
      <div id='login-with-facebook'>
        <FacebookLogin socialId="492933821086948"
                       language="en_US"
                       scope="public_profile,email,user_friends"
                       responseHandler={this.login}
                       xfbml={true}
                       fields="id,email,name"
                       version="v2.10"
                       className="facebook-login"
                       buttonText="Login With Facebook"/>
      </div>
    )
  }
}

export default FindYourBuddy