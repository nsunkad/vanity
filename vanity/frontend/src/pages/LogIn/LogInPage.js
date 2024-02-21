import React from 'react';
import './LoginPage.css'; // Make sure to include the CSS file
import {SubmitButton} from '../../components/general/Buttons.js';

class LogInPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    // Implement your submit logic here
    console.log('Submitted credentials:', this.state.username, this.state.password);
  };

  render() {
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
          <SubmitButton/>
        </form>
      </div>
    );
  }
}

export default LogInPage;
