import React, { useState } from 'react';
import axios from 'axios';
import { URL } from '../../config'
import { useNavigate, Link } from 'react-router-dom'
import './Register.css'


const Register = (props) => {
	const [ form, setValues ] = useState({
		email: '',
		password: '',
		password2: '',
	username: ''
	});
	const [ message, setMessage ] = useState('');

	const navigate=useNavigate()

	const handleChange = (e) => {
		setValues({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		debugger
		e.preventDefault();
		try {
			const response = await axios.post(`${URL}/users/register`, {
				email: form.email,
				password: form.password,
				password2: form.password2,
		username: form.username
			});
			setMessage(response.data.message);
			//console.log(response)
			if (response.data.ok) {
				setTimeout(() => {
					navigate('/login');
				}, 2000);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="login-wrapper">
			<div className="form-box">
			<h1 className="welcome">Welcome to Recipo!</h1>
			<form
				onSubmit={handleSubmit}
				onChange={handleChange}
				className="form-container"
			>
				<div className="inputs-register">
				<label>Username</label>
				<input name="username"/>
				<label>Email</label>
				<input name="email" type="email"/>
				<label>Password</label>
				<input name="password" type="password" />
				<label>Confirm Password</label>
				<input name="password2" type="password" />
				</div>
				<button className="login-button">Register</button>
				<div className="register-box">
				<p>Already have an account?</p>
				<Link to="/login">Login</Link>
				</div>
				<div className="message">
				<h4>{message}</h4>
				</div>
			</form>
			</div>
		</div>
	);
};

export default Register;