import { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import { validateForm } from "../../lib/verify";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {updateUser} = useContext(AuthContext)

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

  const formData = new FormData(e.target); // using new FormData will target the values based on the (name) assigned to the input field in the form
    const errorMessage = validateForm(formData, "login");
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    const username = formData.get("username");
    const password = formData.get("password");

    // console.log(username, password);

    try {
      const res = await apiRequest.post("/auth/login", {
        username,
        password,
      });
      console.log(res)

      updateUser(res.data)
      navigate("/profile");
    } catch (error) {
      console.log(error);
      setError(error.res?.data?.message || "Incorrect Credentials");
    }
      finally {
          setIsLoading(false);
    }
 
  };
  return (
    <div className="login">
      <div className="formContainer">
        <form 
        onSubmit={handleSubmit}
        >
          <h1>Welcome back</h1>
          <input
            name="username"
            required
            minLength={3}
            maxLength={20}
            type="text"
            placeholder="Username"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
          />
          <button 
          disabled={isLoading}
          >
          Login
          </button>
          {error && <span>{error}</span>}
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;
