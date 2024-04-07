import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/form.scss'; // make sure to create a corresponding SCSS file
import logo from '../assets/icons/plentifi.png';
import { deploySmartWallet } from '../background/txSetup';
import { ACCOUNT_PASSWORD } from '../constants';

function SignUpForm() {
  let navigate = useNavigate();

  const [isDeploying, setIsDeploying] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    name: 'John Doe',
    email: 'sudo.user@plentifi.app',
    country: 'France',
    age: '22',
    password: ''
  });


  const routeChange = () => {
    navigate("/Setup");
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // console.log(formData);

    if(!formData.username) {
      alert('Please enter a username');
      return;
    }

    // deploy and fund account
    setIsDeploying(true);
    try {
      await deploySmartWallet(formData.username, true);
      routeChange();

    } catch (error) {
      console.error('Failed to deploy smart wallet:', error);
      // Handle error appropriately
    }
    // } catch (error) {
    //   console.error('Failed to deploy smart wallet:', error);
    //   // Handle error appropriately
    // }
    localStorage.setItem(ACCOUNT_PASSWORD, formData.password);
    setIsDeploying(false);

  };

  return (
    <div className='containerr' /* not a typo !!! */ >
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <img src={logo} alt="Logo" className="logo" />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
        />
        <input
          type="text"
          name="password"
          placeholder="password"
          value={formData.password}
          onChange={handleChange}
        />
        {/* spin if isDeploying === true */}
        <button
          type="submit"
          className="sign-up-button"
          disabled={isDeploying}
        >
          {isDeploying ? (
            <>
              <div className="spinner"></div> Deploying...
            </>
          ) : (
            'Sign Up'
          )}
        </button>
      </form>
    </div>
  );
}

export default SignUpForm;
