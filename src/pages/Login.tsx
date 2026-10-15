import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Function To Handle When Registers New Account
  async function handleSignUp() {
    try {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }
    } catch (error) {
      alert("Unable to connect to the server.");
      console.error(error);
    }
  }

  // Function To Handle When User Logs In
  async function handleLogin() {
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      navigate("/home");
    } catch (error) {
      alert("Unable to connect to the server.");
      console.error(error);
    }
  }

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
      <form
        className="credentials-container"
        onSubmit={(event) => {
          event.preventDefault();

          if (isSignUp) {
            handleSignUp();
          } else {
            handleLogin();
          }
        }}
      >
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
