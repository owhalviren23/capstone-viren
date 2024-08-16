import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import SignupImage from "../../Assets/login.svg";

const Signup = () => {
  // Using the useState hook, creating a state variables for name, email, password, confirm password, mobile & errors along with their setter functions and setting their initial values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState({});
  // With the help of useNavigate() hook, we can easily navigate to different pages
  const navigate = useNavigate();

  // Function for the validation of the Signup form
  const validateForm = () => {
    let signupFormErrors = {};
    let isValid = true;

    // Name validation
    if (!name) {
      isValid = false;
      signupFormErrors["name"] = "Please enter your Name";
    }

    // Email address validation
    if (!email) {
      isValid = false;
      signupFormErrors["email"] = "Please enter an Email Address";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      isValid = false;
      signupFormErrors["email"] = "Email address is not valid";
    }

    // Password validation
    if (!password) {
      isValid = false;
      signupFormErrors["password"] = "Please enter a Password";
    }

    // Confirm Password validation
    if (!confirmPassword) {
      isValid = false;
      signupFormErrors["confirmPassword"] = "Please confirm your Password";
    } else if (password !== confirmPassword) {
      isValid = false;
      signupFormErrors["confirmPassword"] = "Passwords do not match";
    }

    // Mobile validation
    if (!mobile) {
      isValid = false;
      signupFormErrors["mobile"] = "Please enter your Mobile Number";
    } else if (!/^\d{10}$/.test(mobile)) {
      isValid = false;
      signupFormErrors["mobile"] =
        "Please enter a valid 10-digit Mobile Number";
    }

    setErrors(signupFormErrors);
    return isValid;
  };

  // Function to handle Signup form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // If form is valid, then redirect to the Login page
    if (validateForm()) {
      navigate("/");
    }
  };

  return (
    <div className="signup-content">
      <div className="signup-left-part">
        <img src={SignupImage} alt="signup" />
      </div>
      <div className="signup-right-part">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)} // Updating the name state with the help of onChange
          />
          {/* If error exists for the name, then it will be displayed */}
          {errors.name && <p className="signup-error-msg">{errors.name}</p>}

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Updating the email state with the help of onChange
          />
          {/* If error exists for the email address, then it will be displayed */}
          {errors.email && <p className="signup-error-msg">{errors.email}</p>}

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Updating the password state with the help of onChange
          />
          {/* If error exists for the password, then it will be displayed */}
          {errors.password && (
            <p className="signup-error-msg">{errors.password}</p>
          )}

          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            placeholder="Enter your password again"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} // Updating the confirm password state with the help of onChange
          />
          {/* If error exists for the confirm password, then it will be displayed */}
          {errors.confirmPassword && (
            <p className="signup-error-msg">{errors.confirmPassword}</p>
          )}

          <label htmlFor="mobile">Mobile Number</label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            placeholder="Enter your mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)} // Updating the mobile state with the help of onChange
          />
          {/* If error exists for the mobile number, then it will be displayed */}
          {errors.mobile && <p className="signup-error-msg">{errors.mobile}</p>}

          <button type="submit">Sign Up</button>
        </form>
        <div className="signup-login-text">
          Or, Already have an account? <Link to="/">Log In Now!!</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;

// Reference for login.svg, it is taken & downloaded from https://undraw.co/illustrations & https://undraw.co/search
