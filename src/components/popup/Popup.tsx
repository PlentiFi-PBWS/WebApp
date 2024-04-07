import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import './Popup.scss';
import { ACCOUNT_PASSWORD } from '../../constants';
import { FaRegTired } from 'react-icons/fa';

type Props = {
  title: string;
  content: any;
};

const ControlledPopup = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const closeModal = () => {
    setOpen(false);
    setError('');
    setPassword(''); // Clear the password as well
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const checkPasswordAndClose = () => {
    const storedPassword = localStorage.getItem(ACCOUNT_PASSWORD); // Use the constant for the localStorage key
    let isPasswordCorrect = false; // Assume the password is incorrect initially
  
    if (password === storedPassword) {
      // If password is correct
      isPasswordCorrect = true; // Set to true
      setError(''); // Clear any previous error message
    } else {
      // If password is incorrect
      setError('The password is incorrect.'); // Set error message
    }
  
    // Close the modal after 1 second regardless of the password correctness
    setTimeout(() => {
      closeModal();
    }, 1000);
  
    return isPasswordCorrect;
  };

  return (
    <div>
      <button type="button" className="button" onClick={() => setOpen(o => !o)}>
        Controlled Popup
      </button>
      <Popup open={open} closeOnDocumentClick onClose={closeModal}>
        <div className="modal">
          <div className="header">{props.title}</div>
          <div className="content">
            {props.content}
            <input 
              type="password" 
              className="password-input" 
              placeholder="Enter password"
              value={password} 
              onChange={handlePasswordChange} 
            />
            {error && <div className="error">{error}</div>}
          </div>
          <button type="button" className="button" onClick={checkPasswordAndClose}>
            I understand!
          </button>
        </div>
      </Popup>
    </div>
  );
};

export default ControlledPopup;
