import { useState } from "react";

function Login() {
  const [isSignUp, setIsSignUp] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="log-in-page-layout">
      <h1 className="app-name">Nutrition Tracker</h1>

      {/* Onboarding Section */}
      <div className="onboarding-container">
        <button
          type="button"
          className={
            !isSignUp ? "choose-log-in-button active" : "choose-log-in-button"
          }
          onClick={() => setIsSignUp(false)}
        >
          Log in
        </button>

        <button
          type="button"
          className={
            isSignUp ? "choose-sign-up-button active" : "choose-sign-up-button"
          }
          onClick={() => setIsSignUp(true)}
        >
          Sign up
        </button>
      </div>

      {/* Credentials Section */}
      <form className="credentials-container">
        {isSignUp && (
          <div className="name-fields">
            <label className="first-name-field">
              First name
              <input
                name="firstName"
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                required
              />
            </label>

            <label className="last-name-field">
              Last name
              <input
                name="lastName"
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                required
              />
            </label>
          </div>
        )}

        <label className="email-field">
          Email
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="password-field">
          Password
          <input
            name="password"
            type="password"
            placeholder={isSignUp ? "Create a password" : "Enter your password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {isSignUp && (
          <label className="confirm-password-field">
            Confirm password
            <input
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </label>
        )}

        <button className="onboarding-type-button" type="submit">
          {isSignUp ? "Create Account" : "Log in"}
        </button>
      </form>

      {/* Continue With Section */}
      <div className="continue-with-container">
        <h2 className="or-continue-with">or Continue with</h2>

        <button type="button" className="log-in-with-google">
          Google
        </button>

        <button type="button" className="log-in-with-apple">
          Apple
        </button>
      </div>
    </div>
  );
}

export default Login;
