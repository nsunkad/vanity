// import React from 'react';
// import './SignUpPage.css';
// import {SubmitButton} from '../../components/general/Buttons.js';
// // import {MyBagButton} from '../../components/general/Buttons.js';
// import { LogInLink } from '../../components/general/Buttons.js'


// class SignUpPage extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       firstname: '',
//       lastname: '',
//       email: '',
//       username: '',
//       password: '',
//       submissionSuccess: false,
//       errorMessage: ''
//     };
//   }

//   handleInputChange = (event) => {
//     const target = event.target;
//     const value = target.type === 'checkbox' ? target.checked : target.value;
//     const name = target.name;

//     this.setState({
//       [name]: value
//     });
//   };

//   handleSubmit = (event) => {
//     event.preventDefault();

//     const data = {
//         firstname: this.state.firstname,
//         lastname: this.state.lastname,
//         email: this.state.email,
//         username: this.state.username,
//         password: this.state.password,
//     };

//     fetch('http://localhost:8000/register', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Success:', data);
//         this.setState({
//           submissionSuccess: true,
//           inputStyle: { color: 'grey' }
//       });
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });
//   };

//   render() {
//     const { errorMessage } = this.state;
//     return (
//       <div className="signup-container">
//         <h1>sign up</h1>
//         <form onSubmit={this.handleSubmit}>
//           <div className="input-container">
//             <input
//               name="username"
//               type="text"
//               value={this.state.username}
//               onChange={this.handleInputChange}
//               placeholder="Username"
//             />
//           </div>
//           <div className="input-container">
//             <input
//               name="password"
//               type="password"
//               value={this.state.password}
//               onChange={this.handleInputChange}
//               placeholder="Password"
//             />
//           </div>
//           <div className="input-container">
//             <input
//               name="firstname"
//               type="text"
//               value={this.state.firstName}
//               onChange={this.handleInputChange}
//               placeholder="First Name"
//             />
//           </div>
//           <div className="input-container">
//             <input
//               name="lastname"
//               type="text"
//               value={this.state.lastName}
//               onChange={this.handleInputChange}
//               placeholder="Last Name"
//             />
//           </div>
//           <div className="input-container">
//             <input
//               name="email"
//               type="email"
//               value={this.state.email}
//               onChange={this.handleInputChange}
//               placeholder="Email"
//             />
//           </div>
//           <div className="signup-button">
//             <SubmitButton onSubmit={this.handleSubmit}/>
//           </div>
//           {this.state.submissionSuccess &&
//             <p className="signup-success">
//               welcome to vanity
//             </p>}
//           {errorMessage && <p className="error-message">
//           {errorMessage.includes("account with this email already exists") ?
//             <>Account with this email already exists. Click <LogInLink /> to log in.</>
//             : errorMessage}
//         </p>}
//         </form>
//       </div>
//     );
//   }
// }

// export default SignUpPage;
import React from 'react';
import './SignUpPage.css';
import {SubmitButton} from '../../components/general/Buttons.js';
import {LogInLink} from '../../components/general/Buttons.js'; // Ensure this is correctly imported

class SignUpPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      username: '',
      password: '',
      submissionSuccess: false,
      errorMessage: '' // Added to manage error messages
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

    const { firstname, lastname, email, username, password } = this.state;
    const data = {
        firstname,
        lastname,
        email,
        username,
        password
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
          // Handle errors from the server
          this.setState({ errorMessage: data.error, submissionSuccess: false });
        } else {
          console.log('Success:', data);
          this.setState({
            submissionSuccess: true,
            errorMessage: '' // Clear any existing errors on successful submission
          });
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        this.setState({ errorMessage: 'An error occurred. Please try again later.', submissionSuccess: false });
    });
  };

  render() {
    const { firstname, lastname, username, password, email, errorMessage, submissionSuccess } = this.state;
    return (
      <div className="signup-container">
        <h1>Sign Up</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="input-container">
            <input
              name="username"
              type="text"
              value={username}
              onChange={this.handleInputChange}
              placeholder="Username"
            />
          </div>
          <div className="input-container">
            <input
              name="password"
              type="password"
              value={password}
              onChange={this.handleInputChange}
              placeholder="Password"
            />
          </div>
          <div className="input-container">
            <input
              name="firstname"
              type="text"
              value={firstname}
              onChange={this.handleInputChange}
              placeholder="First Name"
            />
          </div>
          <div className="input-container">
            <input
              name="lastname"
              type="text"
              value={lastname}
              onChange={this.handleInputChange}
              placeholder="Last Name"
            />
          </div>
          <div className="input-container">
            <input
              name="email"
              type="email"
              value={email}
              onChange={this.handleInputChange}
              placeholder="Email"
            />
          </div>
          <SubmitButton />
          {submissionSuccess &&
            <p className="signup-success">Welcome to Vanity!</p>
          }
          {errorMessage && <p className="error-message">
            {errorMessage.includes("account with this email already exists") ?
              <>Account with this email already exists. Click <LogInLink /> to log in.</> :
              errorMessage}
          </p>}
        </form>
      </div>
    );
  }
}

export default SignUpPage;