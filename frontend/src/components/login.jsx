import React, { useState, useEffect } from "react";
import "../css/login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../utils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Air } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

//API.get
export default function Login() {
  // const myAPI = 'getUsers'
  // const path = '/api/users'
  // const endpoint = 'https://sy0za5fgni.execute-api.ap-southeast-2.amazonaws.com/main'
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user_id, setUser_id] = useState("");
  const [flag, setFlag] = useState(false);
  function handlePassword(val) {
    setPassword(val.target.value);
  }
  function handleEmail(val) {
    setEmail(val.target.value);
  }
  async function handleSubmit(event) {
    setFlag(true);
    event.preventDefault();

    var requestOptions = {
      email: email,
      password: password,
      redirect: "follow",
      withCredentials: true,
    };
    try {
      await axios
        .post(`${API_URL}/login`, requestOptions)
        .then(
          (data) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                console.log(data);
                // change the backend to give consistent status and data message response
                if (data["status"] === 200) {
                  const role = data["data"].user_role;

                  localStorage.setItem("authToken", data.data.token);
                  localStorage.setItem("role", role);
                  localStorage.setItem("user_id", data.data.user_id);
                  localStorage.setItem("username", data.data.username);
                  const token = localStorage.getItem("authToken");

                  const myHeaders = new Headers();
                  myHeaders.append("Authorization", `Bearer ${token}`);
                  setUser_id(data.data.user_id);
                  if (data.data.user_role.toLowerCase() === "student") {
                    navigate("/student", { replace: true });
                  } else if (data.data.user_role.toLowerCase() === "employer") {
                    navigate("/employer");
                  } else if (data.data.user_role === "Job Seeker") {
                    navigate("/jobseeker");
                  } else if (data.data.user_role === "admin") {
                    navigate("/admin");
                  }
                } else {
                  setFlag(false);
                }
              }, 1);
            })
        )
        .catch(function (error) {
          if (error.response.status == 401) {
            toast.error("Invalid password. Please try again");
            setFlag(false);
          } else if (error.response.status == 404) {
            toast.error("user not found . Please signup");
          }
        });
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    if (user_id) {
      navigate("/");
    }
  });

  return (
    <div id="bannerImage" style={{ width: "100%" }}>
      <div className="container">
        <div className="m-auto form-container">
          <Grid container justifyContent="center">
            <Grid
              item
              lg={7}
              md={8}
              xs={11}
              bgcolor="whitesmoke"
              borderRadius={2}
              py={7}
              px={5}
            >
              <Typography variant="h4" pb={3} sx={{ textAlign: "center" }}>
                Login
              </Typography>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <TextField
                    id="InputEmail"
                    label="Enter Email"
                    variant="outlined"
                    required
                    fullWidth
                    onChange={handleEmail}
                  />
                </div>
                <div className="mb-4">
                  <TextField
                    id="InputEmail"
                    label="Enter Password"
                    variant="outlined"
                    required
                    fullWidth
                    onChange={handlePassword}
                  />
                </div>
                <div className="mb-3 ">
                  <a className="link-primary" href="/signup">
                    Don't have account? Signup Here
                  </a>
                  <br />
                  <a className="link-primary" href="/forgot_password">
                    Forgot Password?
                  </a>
                </div>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  type="submit"
                  disabled={flag}
                >
                  {flag ? (
                    <>
                      Loading
                      <CircularProgress size={20} sx={{ ml: 3 }} />
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </form>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}
