import React from 'react';
import './SignUpPage.css';
import { SubmitButton } from '../../components/general/Buttons.js';
import { LogInLink } from '../../components/general/Buttons.js';
import { UserContext } from '../../context/UserContext.js'; // Ensure you have the correct import path
import { MyBagButton } from '../../components/general/Buttons.js';

class SignUpPage extends React.Component {
  static contextType = UserContext; // Correctly access the UserContext

  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      submissionSuccess: false,
      errorMessage: ''
    };
  }

  handleInputChange = (event) => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { userName, firstName, lastName, email, password } = this.state;
    if (!userName || !firstName || !lastName || !email || !password) {
      this.setState({ errorMessage: 'please fill all fields.', submissionSuccess: false });
      return;
    }
    const data = {
        username: userName,
        firstname: firstName,
        lastname: lastName,
        email: email,
        password: password
    };

    fetch('http://localhost:8000/register', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
          this.setState({ errorMessage: data.error, submissionSuccess: false });
        } else {
          this.context.login(data); // Update user context with received user info
          this.setState({
            submissionSuccess: true,
            errorMessage: ''
          });
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        this.setState({ errorMessage: 'An error occurred. Please try again later.', submissionSuccess: false });
    });
  };

  render() {
    const { userName, firstName, lastName, email, password, submissionSuccess, errorMessage } = this.state;
    // Only construct the welcome message if submission is successful
    const welcomeMessage = submissionSuccess && this.context.user ? `welcome to vanity, ${this.context.user.firstName}!` : "";

    return (
      <div className="signup-container">
        <h1>Sign Up</h1>
        <form onSubmit={ this.handleSubmit }>
          <div className="input-container">
            <input
              name="userName"
              type="text"
              value={ userName }
              onChange={ this.handleInputChange }
              placeholder="Username"
            />
          </div>
          <div className="input-container">
            <input
              name="password"
              type="password"
              value={ password }
              onChange={ this.handleInputChange }
              placeholder="Password"
            />
          </div>
          <div className="input-container">
            <input
              name="firstName"
              type="text"
              value={ firstName }
              onChange={ this.handleInputChange }
              placeholder="First Name"
            />
          </div>
          <div className="input-container">
            <input
              name="lastName"
              type="text"
              value={ lastName }
              onChange={ this.handleInputChange }
              placeholder="Last Name"
            />
          </div>
          <div className="input-container">
            <input
              name="email"
              type="email"
              value={ email }
              onChange={ this.handleInputChange }
              placeholder="Email"
            />
          </div>
          <SubmitButton/>
        </form>
          {submissionSuccess &&
            <>
              <p className="signup-success">{ welcomeMessage }</p>
              <MyBagButton /> {/* This will render the MyBagButton on successful signup */}
            </>
          }
          {errorMessage && <p className="error-message">
            {errorMessage.includes("account with this email already exists") ?
              <>account with this email already exists. click <LogInLink /> to log in.</> :
              errorMessage}
          </p>}
        
      </div>
    );
  }
}

export default SignUpPage;
