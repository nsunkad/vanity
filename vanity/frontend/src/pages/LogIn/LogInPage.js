import React from 'react';
import './LoginPage.css'; // Make sure to include the CSS file
import {SubmitButton} from '../../components/general/Buttons.js';
import { useNavigate } from 'react-router-dom';

class LogInPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errorMessage: '',
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
    console.log('Submitted credentials:', this.state.username, this.state.password);
    const { username, password } = this.state;

    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Login Successful:', data);
        this.props.history.push('/mybag');
      } else {
        this.setState({ errorMessage: data.error });
      }
    })
    .catch(error => {
      console.error('Error:', error);
      this.setState({ errorMessage: 'An error occurred. Please try again later.' });
    });
  };

  render() {
    const { errorMessage } = this.state;
    return (
      <div className="login-container">
        <h1>log in</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="input-container">
            <input
              name="username"
              type="text"
              value={this.state.username}
              onChange={this.handleInputChange}
              placeholder="username"
            />
          </div>
          <div className="input-container">
            <input
              name="password"
              type="password"
              value={this.state.password}
              onChange={this.handleInputChange}
              placeholder="password"
            />
          </div>
          <SubmitButton onSubmit={this.handleSubmit}/>
        </form>
      </div>
    );
  }
}

export default LogInPage;
