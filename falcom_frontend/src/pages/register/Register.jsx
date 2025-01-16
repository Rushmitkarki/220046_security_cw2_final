import React, { useState } from 'react';
import registerui from '../../assets/images/loginui.png';
import './Register.css';
import { Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { registerUserApi } from '../../apis/Api';

function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUsername] = useState('');
    const[phoneNumber, setPhoneNumber] = useState(''); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const validateForm = () => {
        let isValid = true;
        if (!firstName.trim()) {
            setFirstNameError('First Name is required');
            isValid = false;
        } else if (firstNameError) {
            setFirstNameError('');
        }
        if (!lastName.trim()) {
            setLastNameError('Last Name is required');
            isValid = false;
        } else if (lastNameError) {
            setLastNameError('');
        }
        if (!userName.trim()) {
            setUsernameError('Username is required');
            isValid = false;
        } else if (usernameError) {
            setUsernameError('');
        }
        if (!phoneNumber.trim()) {
            setPhoneNumberError('Phone Number is required');
            isValid = false;
        } else if (phoneNumberError) {
            setPhoneNumberError('');
        }
        if (!email.trim()) {
            setEmailError('Email is required');
            isValid = false;
        } else if (emailError) {
            setEmailError('');
        }
        if (!password.trim()) {
            setPasswordError('Password is required');
            isValid = false;
        } else if (passwordError) {
            setPasswordError('');
        }
        if (!confirmPassword.trim()) {
            setConfirmPasswordError('Confirm Password is required');
            isValid = false;
        } else if (confirmPasswordError) {
            setConfirmPasswordError('');
        }
        if (password.trim() !== confirmPassword.trim()) {
            setConfirmPasswordError('Passwords do not match');
            isValid = false;
        } else if (confirmPasswordError) {
            setConfirmPasswordError('');
        }
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!validateForm()) {
            return;
        }

        // Prepare data for API call
        const data = {
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            phoneNumber: phoneNumber,
            email: email,
            password: password,
        };
 
        // Make API call
        registerUserApi(data)
            .then((response) => {
                // Handle success response
                toast.success('Registration successful! Please login to continue.');
            })
            .catch((error) => {
                // Handle error response
                toast.error('Registration failed. Please try again.');
            });
    };

    return (
        <div className="register-container">
            <Toaster />
            <div className="register-box">
                <div className="register-form">
                    <h2 className="register-title">Register</h2>
                    <p className="register-subtitle">Please fill in the details to create an account</p>

                    <form onSubmit={handleSubmit} className="register-fields">
                        <div className="input-container">
                            <input
                                className="register-input"
                                type="text"
                                name="firstname"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            {firstNameError && <p className="error-message">{firstNameError}</p>}
                        </div>
                        <div className="input-container">
                            <input
                                className="register-input"
                                type="text"
                                name="lastname"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            {lastNameError && <p className="error-message">{lastNameError}</p>}
                        </div>
                        <div className="input-container">
                            <input
                                className="register-input"
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={userName}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            {usernameError && <p className="error-message">{usernameError}</p>}
                        </div>
                        <div className="input-container">
                            <input
                                className="register-input"
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {emailError && <p className="error-message">{emailError}</p>}
                        </div>
                        <div className="input-container">
                            <input
                                className="register-input"
                                type="phone"
                                name="phone"
                                placeholder="Phone Number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            {phoneNumberError && <p className="error-message">{phoneNumberError}</p>}
                        </div>
                        <div className="input-container">
                            <input
                                className="register-input"
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {passwordError && <p className="error-message">{passwordError}</p>}
                        </div>
                        <div className="input-container">
                            <input
                                className="register-input"
                                type="password"
                                name="confirm-password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
                        </div>
                        <button type="submit" className="register-button">
                            Register
                        </button>
                    </form>

                    <div className="login-link">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="register-image">
                    <img src={registerui} alt="Register" />
                </div>
            </div>
        </div>
    );
}

export default Register;
