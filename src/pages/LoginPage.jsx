"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../components/MovieList.css"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login
    setTimeout(() => {
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userEmail", email)
      setIsLoading(false)
      navigate("/")
    }, 1000)
  }

  return (
    <div className="movie-website-container">
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <Link to="/" className="back-btn">
              ← Back to Home
            </Link>
            <div className="auth-logo">
              <img src="/images/mobifone-logo.png" alt="MobiFone" className="logo-image" />
            </div>
          </div>

          <div className="auth-form-container">
            <h2>Login to Your Account</h2>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>

              <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
