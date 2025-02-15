import React from 'react'
import './LoginForm.css'

export default function LoginForm() {
  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="form-input"
            />
          </div>
          <div className="button-group">
            <button type="submit" className="btn btn-login">
              Login
            </button>
            <button type="button" className="btn btn-register">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}