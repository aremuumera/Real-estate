import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Remove the duplicate import
import { useState } from "react";
import { validateForm } from "../../lib/verify";
import apiRequest from "../../lib/apiRequest";

function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  //validating form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    const formData = new FormData(e.target); // using new FormData will target the values based on the (name) assigned to the input field in the form
    const errorMessage = validateForm(formData, "register");
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    console.log(username, email, password);

    try {
      const res = await apiRequest.post("/auth/register", {
        username,
        email,
        password,
      });
      console.log(res)
      navigate("/login");
    } catch (error) {
      console.log(error);
      setError(error.res?.data?.message || "Registration failed");
    }
    finally {
        setIsLoading(false);
      }
  };

  return (
    <div className="registerPage max-[630px]:flex max-[630px]:justify-center max-[630px]:items-center ">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <input name="username" type="text" placeholder="Username" />
          <input name="email" type="text" placeholder="Email" />
          <input name="password" type="password" placeholder="Password" />
          <button 
          disabled={isLoading}
          >Register</button>
          {error && <span>{error}</span>} 
          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>
      <div className="hidden  sm:block imgContainer">
        <img src="/bg.png" alt="" className="hidden sm:block" />
      </div>
    </div>
  );
}

export default Register;
