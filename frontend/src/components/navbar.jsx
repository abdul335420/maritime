import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/navbar.css";
import { API_URL } from "../utils";
import axios from "axios";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import qs from "qs";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("authToken");
  const [unRead, setUnRead] = useState(0);
  const [unReadNotifications, setUnReadNotifications] = useState([]);
  const user_id = localStorage.getItem("user_id");

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function getNotifications() {
    await axios
      .get(`${API_URL}/notification_by_user_id/` + user_id, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          const data = response.data;
          setNotifications(data);
          countUnReadNotifications(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async function updateNotifications(setUnRead) {
    for (const notification of unReadNotifications) {
      let notification_id = notification.notification_id;

      const data = qs.stringify(notification_id);
      const response = axios.put(
        `${API_URL}/update_notification/${notification_id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
    }
    getNotifications();
    countUnReadNotifications(notifications);
  }
  async function countUnReadNotifications(data) {
    setUnReadNotifications(data.filter((notification) => !notification.IsRead));
    const count = data.filter((notification) => !notification.IsRead).length;

    setUnRead(count);
    return count;
  }

  useEffect(() => {
    if (token) {
      getNotifications();
    }
  }, [getNotifications, token]);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light position-sticky top-0 z-index-1 p-3"
      data-navbar-on-scroll="data-navbar-on-scroll"
      style={{
        background:
          " linear-gradient(208.18deg, #284c81 76.74% , #2844F7 9.05% )",
        marginBottom: "0px",
      }}
    >
      <div className="container-fluid">
        <a
          className="navbar-brand d-flex align-items-center fw-bolder fs-2 fst-italic"
          href="/"
        >
          <div className="text-info">Mari</div>
          <div className="text-warning">Time</div>
        </a>
        <button
          className="navbar-toggler collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse border-top border-lg-0 mt-4 mt-lg-0"
          style={{ marginRight: "10%" }}
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav ms-auto pt-2 pt-lg-0">
            <li className="nav-item px-2">
              <a className="fw-medium nav-link" aria-current="page" href="/">
                Home
              </a>
            </li>

            <li
              style={{
                display:
                  role === "admin"
                    ? ""
                    : role === "employer"
                    ? ""
                    : role === "Job Seeker"
                    ? ""
                    : !username
                    ? ""
                    : "none",
              }}
            >
              <Link
                className={
                  location.pathname === "/jobs"
                    ? "active fw-medium nav-link"
                    : "fw-medium nav-link"
                }
                to={role === "admin" ? "manage_jobs" : "/jobs"}
              >
                Jobs
              </Link>
            </li>

            <li
              style={{
                display:
                  role === "admin"
                    ? "none"
                    : !username || role === "student"
                    ? ""
                    : "none",
              }}
              className="nav-item px-2"
            >
              <a
                className={
                  location.pathname === "/courses_list"
                    ? "active fw-medium nav-link"
                    : "fw-medium  nav-link "
                }
                href="/courses_list"
              >
                Courses
              </a>
            </li>
            <li
              style={{
                display:
                  role === "admin"
                    ? "none"
                    : !username || role === "student"
                    ? ""
                    : "none",
              }}
              className="nav-item px-2"
            >
              <Link
                className={
                  location.pathname === "/programs"
                    ? "active fw-medium nav-link "
                    : "fw-medium nav-link"
                }
                to="/programs"
              >
                Training Programs
              </Link>
            </li>
            <li
              style={{ display: role === "admin" ? "" : "none" }}
              className="nav-item px-2"
            >
              <Link
                className={
                  location.pathname === "/programs"
                    ? "active fw-medium nav-link "
                    : "fw-medium nav-link"
                }
                to="/programs&courses_management"
              >
                {" "}
                Courses and programs
              </Link>
            </li>
            <li
              style={{ display: role === "student" ? "" : "none" }}
              className="nav-item px-2"
            >
              <Link
                className={
                  location.pathname === "/student"
                    ? "active fw-medium nav-link "
                    : "fw-medium nav-link "
                }
                to="/student"
              >
                Student Portal
              </Link>
            </li>
            <li
              style={{ display: role === "student" ? "" : "none" }}
              className="nav-item px-2"
            >
              <Link
                className={
                  location.pathname === "/my_course&program"
                    ? "active fw-medium nav-link "
                    : "fw-medium nav-link "
                }
                to="/my_course&programs"
              >
                My Courses & programs
              </Link>
            </li>

            <li
              style={{ display: role === "admin" ? "" : "none" }}
              className="nav-item"
            >
              <Link
                className={
                  location.pathname === "/students_list"
                    ? "active fw-medium nav-link "
                    : "fw-medium nav-link"
                }
                to="/students_list"
              >
                Students
              </Link>
            </li>
            <li
              style={{ display: role === "admin" ? "" : "none" }}
              className="nav-item"
            >
              <Link
                className={
                  location.pathname === "/employers_list"
                    ? "active fw-medium nav-link "
                    : "fw-medium nav-link"
                }
                to="/employers_list"
              >
                Employers
              </Link>
            </li>
            <li
              style={{ display: role === "Job Seeker" ? "" : "none" }}
              className="nav-item"
            >
              <Link
                className={
                  location.pathname === "/applied_jobs"
                    ? "active fw-medium nav-link "
                    : "fw-medium nav-link"
                }
                to="/applied_jobs"
              >
                My Applications
              </Link>
            </li>

            <li className="nav-item">
              <a
                style={{ display: role === "employer" ? "" : "none" }}
                className={
                  location.pathname === "/job_applications"
                    ? "active fw-medium nav-link "
                    : "fw-medium nav-link"
                }
                href="/job_applications"
              >
                My Jobs
              </a>
            </li>
            <li
              style={{ display: role === "employer" ? "" : "none" }}
              className="nav-item"
            >
              <a
                className={
                  location.pathname === "/employer"
                    ? "active fw-medium nav-link "
                    : "fw-medium nav-link"
                }
                href="/post_job"
              >
                Post a job
              </a>
            </li>
            <li
              style={{ display: role === "admin" ? "" : "none" }}
              className="nav-item"
            >
              <a
                className={
                  location.pathname === "/admin"
                    ? "active fw-medium nav-link "
                    : "fw-medium nav-link"
                }
                href="/admin"
              >
                Admin Portal
              </a>
            </li>
            {/* <li style={{display:role==='admin'?"":'none'}} className='nav-item'>
              <a className={location.pathname === '/messages_page' ? "active fw-medium nav-link " : "fw-medium nav-link"} href="/messages_page">Messages</a>
            </li> */}

            <li
              style={{ display: username ? "" : "none" }}
              className="nav-item"
            >
              <a
                className={
                  location.pathname === "/user_messages"
                    ? "active fw-medium nav-link "
                    : "fw-medium nav-link"
                }
                href="/user_messages"
              >
                Messages
              </a>
            </li>

            {/* add a dropdown here  */}
            <div className="dropdown">
              <li className="nav-item">
                <a
                  onClick={updateNotifications}
                  style={{
                    display: username && role !== "admin" ? "" : "none",
                  }}
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  className={
                    location.pathname === "/#notifications"
                      ? "active fw-medium nav-link "
                      : "fw-medium nav-link "
                  }
                  href="#notifications"
                >
                  <Badge badgeContent={unRead} color="warning">
                    <NotificationsIcon
                      color="light"
                      style={{ fontSize: "large" }}
                    />
                  </Badge>
                </a>
                <ul className="dropdown-menu notifications">
                  {notifications.length === 0 ? (
                    <li className="">No notifications</li>
                  ) : (
                    notifications.map((notification) => (
                      <li
                        key={notification.notification_id}
                        style={{ fontSize: "small" }}
                      >
                        {notification.content}{" "}
                        {/* Assuming notifications have a title property */}
                        <hr />
                      </li>
                    ))
                  )}
                </ul>
              </li>
            </div>
            <li className="nav-item">
              <Link
                style={{ display: role === "admin" ? "" : "none" }}
                className={
                  location.pathname === "/admin_notifications"
                    ? "active fw-medium nav-link "
                    : "fw-medium nav-link"
                }
                to="/admin_notifications"
              >
                Notifications
              </Link>
            </li>
            <li
              className="nav-item px-2 "
              style={{ display: username ? "none" : "" }}
            >
              <a
                className={
                  location.pathname === "/login"
                    ? "active fw-medium nav-link "
                    : "fw-medium nav-link"
                }
                href="/login"
              >
                Sign in{" "}
              </a>
            </li>
            <li
              className="nav-item px-2 "
              style={{ display: username ? "none" : "" }}
            >
              <a
                className={
                  location.pathname === "/signup"
                    ? "active fw-medium nav-link "
                    : "fw-medium nav-link"
                }
                href="/signup"
              >
                Signup
              </a>
            </li>
            <li
              style={{ display: username ? "" : "none" }}
              className="nav-item px-2 "
            >
              <a
                className={
                  location.pathname === "/#"
                    ? "active fw-medium nav-link "
                    : "fw-medium nav-link"
                }
                href="#"
                onClick={handleLogout}
              >
                Logout{" "}
              </a>
            </li>
            <li className="nav-item px-2">
              <a
                className={
                  location.pathname === "/profile" ||
                  location.pathname === "/employer_profile" ||
                  location.pathname === "/jobseeker_profile"
                    ? "active fw-medium nav-link "
                    : "fw-medium nav-link"
                }
                href={
                  role === "student"
                    ? "/profile"
                    : role === "employer"
                    ? "/employer_profile"
                    : role === "Job Seeker"
                    ? "/jobseeker_profile"
                    : ""
                }
              >
                <span> {username && username} </span>
                <span style={{ fontSize: "10px" }}>
                  {username && "(" + role + ")"}
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
