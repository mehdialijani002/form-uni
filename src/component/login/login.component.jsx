import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    apiError: "", // New error state for API error
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: "",
      password: "",
      apiError: "", // Initialize the API error message
    };

    if (!formData.username.trim()) {
      isValid = false;
      newErrors.username = "نام کاربری را وارد کنید";
    }

    if (!formData.password.trim()) {
      isValid = false;
      newErrors.password = "رمز عبور را وارد کنید";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleApiError = (errorMessage) => {
    setErrors({ ...errors, apiError: errorMessage });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "username" || name === "password") {
      validateForm();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Call your authentication API here
      try {
        const response = await fetch("YOUR_API_ENDPOINT", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          // Authentication succeeded, navigate to the next page
          navigate("/form-table");
        } else {
          // Authentication failed, handle the error message from the API
          const data = await response.json();
          handleApiError(data.errorMessage); // Replace with the actual API response structure
        }
      } catch (error) {
        // Handle network or other errors
        console.error("API Error:", error);
        handleApiError(
          "نام کاربری یا رمز عبور نادرست است لطفا مجددا وارد کنید."
        );
      }
    }
  };

  return (
    <div className="login-container">
      <h4 className="mb-5">به بخش مدیریت خوش امدید</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control
            type="text"
            name="username"
            placeholder="نام کاربری"
            value={formData.username} // Change from formData.email to formData.username
            onChange={handleChange}
          />
          <div className="text-danger">{errors.username}</div>{" "}
          {/* Change from errors.email to errors.username */}
        </Form.Group>
        <Form.Group className="mt-3 mb-4" controlId="formBasicPassword">
          <Form.Control
            type="password"
            name="password"
            placeholder="رمز عبور"
            value={formData.password}
            onChange={handleChange}
          />
          <div className="text-danger">{errors.password}</div>
        </Form.Group>

        <div className="text-danger">{errors.apiError}</div>

        <div className="d-flex justify-content-center">
          <button type="submit" className="login-btn w-100">
            ورود
          </button>
        </div>
      </Form>
    </div>
  );
}

export default Login;
