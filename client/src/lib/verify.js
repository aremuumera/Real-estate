export const validateForm = (formData, formType) => {
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
  
    if (formType === "register") {
      if (!username) return "Username is required";
      if (!email) return "Email is required";
      if (!/\S+@\S+\.\S+/.test(email)) return "Email is invalid";
      if (!password) return "Password is required";
      if (password.length < 6) return "Password must be at least 6 characters long";
    } else if (formType === "login") {
      if (!username) return "Username is required";
      if (!password) return "Password is required";
    }
  
    return null;
  };
  