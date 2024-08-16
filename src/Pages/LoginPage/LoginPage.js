
import {React, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import LoginImage from "../../Assets/login.svg";
import { useMutation } from "@apollo/client";
import Cookies from "js-cookie";
import { SIGNIN } from "../../graphql/Mutation/Signin";
import { jwtDecode } from "jwt-decode";

const LoginPage = (props) => {
  // Using the useState hook, creating a state variables for authError, isLoading, email & password along with their setter functions and setting their initial values.
  // With the help of useNavigate() hook, we can easily navigate to different pages.
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // useMutation hook for the SIGNIN mutation
  const [signin] = useMutation(SIGNIN, {
    // onCompleted callback, when mutation is completed successfully
    onCompleted({ signin }) {
      setIsLoading(false);
      // checking the JWT token in the response. if present then, it will store & decode a JWT token in cookies.
      // After that, it will redirect to the register shop page or else, if there is any authetication error exists then it will display that error.
      if (signin?.jwtToken) {
        Cookies.set("jwtToken", signin.jwtToken);

        const decoded = jwtDecode(signin.jwtToken);
        Cookies.set("user_id", JSON.stringify(decoded.user_id));
        // storing the email address & password of the user account in a cookies
        Cookies.set("email", email);
        Cookies.set("password", password);

        navigate("/registerShop");
      } else {
        setAuthError("Invalid Credentials");
      }
    },
    // onError callback, when mutation is not completed successfully
    onError(error) {
      setAuthError("Invalid Credentials");
    },
  });

  // Function to handle Login form submission
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // passing the email variable & password variable to signin mutation
    signin({
      variables: {
        email: email,
        password: password,
      },
    });
  };

  // if loading state is true, then it will display a loading message
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="login-content">
      <div className="login-left-part">
        <img src={LoginImage} alt="login" width={400} height={400} />
      </div>
      <div className="login-right-part">
        <h1>Welcome to Tailor's Data</h1>
        <h2>Log In</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Updating the email state with the help of onChange
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Updating the password state with the help of onChange
          />

          {/* If any authentication error exists, then it will be displayed */}
          {authError && <p style={{ color: "red" }}>{authError}</p>}

          <button type="submit">Log in</button>
        </form>
        <div className="login-signup-text">
          Or, Don't have an account? <Link to="/signup">Sign Up Now!!</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

// Reference for login.svg, it is taken & downloaded from https://undraw.co/illustrations & https://undraw.co/search
