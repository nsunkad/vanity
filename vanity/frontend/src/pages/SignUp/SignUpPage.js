import React from 'react';
import './SignUpPage.css'; // Make sure to include the CSS file
import {SubmitButton} from '../../components/general/Buttons.js';

class SignUpPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      username: '',
      password: '',
    };
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const data = {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        email: this.state.email,
        username: this.state.username,
        password: this.state.password,
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
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
  };

  render() {
    return (
      <div className="signup-container">
        <h1>Sign Up</h1>
        <form onSubmit={this.handleSubmit}>
        <div className="input-container">
            <input
              name="username"
              type="text"
              value={this.state.username}
              onChange={this.handleInputChange}
              placeholder="Username"
            />
          </div>
          <div className="input-container">
            <input
              name="password"
              type="password"
              value={this.state.password}
              onChange={this.handleInputChange}
              placeholder="Password"
            />
          </div>
          <div className="input-container">
            <input
              name="firstname"
              type="text"
              value={this.state.firstName}
              onChange={this.handleInputChange}
              placeholder="First Name"
            />
          </div>
          <div className="input-container">
            <input
              name="lastname"
              type="text"
              value={this.state.lastName}
              onChange={this.handleInputChange}
              placeholder="Last Name"
            />
          </div>
          <div className="input-container">
            <input
              name="email"
              type="email"
              value={this.state.email}
              onChange={this.handleInputChange}
              placeholder="Email"
            />
          </div>
          <SubmitButton onSubmit={this.handleSubmit}/>
        </form>
      </div>
    );
  }
}

export default SignUpPage;