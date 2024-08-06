import React, { useState } from "react";
import axios from "axios";
import { URL } from '../../config'
import { useNavigate, Link } from "react-router-dom";
import './Login.css';
// import jwt from 'jsonwebtoken'
// react-scripts from version 5 shipped with react 18 is not supporting jsonwebtoken so we need to use alternative like jose to decode the JWT token in the client
import * as jose from "jose";

const Login = (props) => {
  const [form, setValues] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setValues({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    debugger;
    e.preventDefault();
    try {
      const response = await axios.post(`${URL}/users/login`, {
        email: form.email.toLowerCase(),
        password: form.password,
      });
      setMessage(response.data.message);
      if (response.data.ok) {
        // here after login was successful we extract the email passed from the server inside the token
        let decodedToken = jose.decodeJwt(response.data.token);
        // and now we now which user is logged in in the client so we can manipulate it as we want, like fetching data for it or we can pass the user role -- admin or not -- and act accordingly, etc...
        console.log(
          "Email extracted from the JWT token after login: ",
          decodedToken.userEmail
        );
        setTimeout(() => {
          props.login(response.data.token);
          navigate("/");
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
          <div className="inputs">
            <label>Email</label>
            <input name="email" />
            <label>Password</label>
            <input name="password" />
          </div>
          <button className="login-button">Login</button>
          <div className="register-box">
            <p>Don't have an account?</p>
            <Link to="/register">Register</Link>
          </div>
          <div className="message">
            <h4>{message}</h4>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;