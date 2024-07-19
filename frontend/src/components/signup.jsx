import { useNavigate } from "react-router-dom";
import "../css/home.css";
import { useState } from "react";
import axios from "axios";
import React from "react";
import { API_URL } from "../utils.js";
import "../css/signup.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

export default function Signup() {
  const navigate = useNavigate();
  const [signupForm, setsignupForm] = useState({
    username: "",
    email: "",
    password: "",
    password1: "",
    role: "",
    age: 0,
    gender: "",
  });
  function handleChange(e) {
    const { name, value } = e.target;
    setsignupForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
  function isValidEmail() {
    return /\S+@\S+\.\S+/.test(signupForm.email);
  }
  function isValidPassword() {
    const isPassword =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,10}$/.test(
        signupForm.password
      );
    const isPassword2 =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,10}$/.test(
        signupForm.password1
      );
    if (isPassword !== isPassword2) {
      toast.error("Passwords does not match");
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const { password1, ...body } = signupForm;
    console.log(body);
    const response = await axios
      .post(`${API_URL}/create_user`, body)
      .then(
        (data) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              console.log(data);
              if (data["status"] === 201) {
                console.log(data);
                toast.success("user signed up successfully");
                navigate("/login");
              }
            }, 1);
          })
      )
      .catch(function (error) {
        console.log(error);
      });
    toast.success("user signed up");
    navigate("/login");
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center sign-up-div"
      style={{
        minHeight: "100vh",
      }}
    >
      <div className="container ">
        <div className="">
          <div>
            <Grid
              item
              md={7}
              xs={11}
              bgcolor="whitesmoke"
              borderRadius={2}
              px={3}
              py={7}
            >
              <Typography variant="h4" pb={3} sx={{ textAlign: "center" }}>
                Create Account
              </Typography>
              <form
                onSubmit={handleSubmit}
              >
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      type="email"
                      label="Email Address"
                      onChange={handleChange}
                      name="email"
                      id="InputEmail"
                      aria-describedby="emailHelp"
                      required
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      type="text"
                      label="Full Name"
                      onChange={handleChange}
                      id="InputUserName"
                      name="username"
                      aria-describedby="UserNameHelp"
                      required
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="password"
                      label="Password"
                      onChange={handleChange}
                      id="InputPassword"
                      name="password"
                      required
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="password"
                      label="Re enter password"
                      onChange={handleChange}
                      name="password1"
                      id="InputPassword1"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputLabel sx={{ textAlign: "start" }}>
                      Select Role
                    </InputLabel>

                    <Select
                      onChange={handleChange}
                      fullWidth
                      name="role"
                      value={signupForm.role}
                      required
                    >
                      <MenuItem value="student">Student</MenuItem>
                      <MenuItem value="employer">Employer</MenuItem>
                      <MenuItem value="Job Seeker">Job Seeker</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={12}>
                    <InputLabel sx={{ textAlign: "start" }}>Gender</InputLabel>
                    <Select
                      onChange={handleChange}
                      fullWidth
                      name="gender"
                      value={signupForm.gender}
                      required
                    >
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Others">Others</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="number"
                      label="Age"
                      name="age"
                      onChange={handleChange}
                      min="18"
                      required
                      max="70"
                    />
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  type="submit"
                  sx={{ mt: 5 }}
                >
                  Sign Up
                </Button>
              </form>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
}
