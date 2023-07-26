import React, { useState } from 'react';
import './style.scss';
const isExist = true;

const Login = () => {
 
  return (
      <div className="login-body">
          
    <div className="login-form">
  
    <div className="centeredDiv">
        <div className="sign-wrapper">
{!isExist && <span className="error">User not authorized</span>}
<div className="input-container">
<input type="text" name="user" placeholder="Username" className="user"/>
<input type="password" name="password" placeholder="***********" className="password" />
<button className="forgot-link">Forgot Password?</button>
</div>
<button className="btn primary btn-submit" type="submit">Submit</button>
</div>
{/* <div className="img-wrapper">
    <img src={loginbg} alt=""/>
</div> */}
</div>
</div>
</div>
  );
};

export default Login;
