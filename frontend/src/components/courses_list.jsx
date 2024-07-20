import "../css/courses.css";
import courseImage from "../assets/images.jpg";
import React from "react";
import courseBanner from "../assets/study-w1880x1253.jpeg";
import { API_URL } from "../utils";
import SearchIcon from "@mui/icons-material/Search";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import qs from "qs";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
export default function CoursesList() {
  const [courses, setCourses] = useState([]);
  const stdID = localStorage.getItem("std_id");
  const [filterQuery, setFilterQuery] = useState();
  const [searchQuery, setSearchQuery] = useState([]);

  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const myHeaders = new Headers();
  function handleFilterChange(e) {
    setFilterQuery(e.target.value);
    console.log("filter", filterQuery);
  }

  const fetchData = useCallback(async () => {
    if (stdID) {
      const response = await axios.get(`${API_URL}/courses`);
      if (response.status === 200) {
        const all_courses = response.data.data;
        const coursesToRemove = await filterunAppliedCourses();

        const filteredCourses = all_courses.filter((course) => {
          // Check if course_id in any object of coursesToRemove matches the current course
          return !coursesToRemove.some(
            (courseToRemove) => courseToRemove.course_id === course.course_id
          );
        });
        setCourses(filteredCourses);
      }
    } else {
      try {
        const response = await axios.get(`${API_URL}/courses`);
        if (response.status === 200) {
          setCourses(response.data.data);
          console.log(response.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, []);
  const enrollCourse = async (id) => {
    if (!stdID) {
      navigate("/login");
    } else {
      let data = qs.stringify({
        AppDate: new Date().toISOString().slice(0, 19).replace("T", " "),
        Status: '"pending"',
        course_id: id,
        program_id: 1,
        std_id: stdID,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${API_URL}/apply_for_course`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data,
      };
      const response = await axios
        .request(config)
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            toast.success("Course enrolled successfully");
          }
        })
        .catch((error) => {
          console.log("error");
          console.log(error);
          if (error.response.status === 409) {
            toast.info("Already applied to this course");
          }
        });
      console.log(response);
    }
  };
  function search(data) {
    if (searchQuery.length > 1)
      return data.filter((course) =>
        course.course_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }
  function filterCourses(data) {
    if (filterQuery) {
      console.log(filterQuery, "filter query");
      console.log("data", data);
      console.log(
        data.filter((obj) => {
          return obj.duration_months === filterQuery;
        })
      );
      return data.filter((obj) => {
        return obj.duration_months === filterQuery;
      });
    }
  }
  async function filterunAppliedCourses() {
    const response = await axios.get(
      `${API_URL}/course_application_by_std/${stdID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.data;
  }
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div style={{ minHeight: "100vh" }} id="CourseBanner">
      <ToastContainer />

      <div className="d-flex flex-column sidebar flex-shrink-0 p-3 bg-light ">
        <h3>Search Courses</h3>

        <hr />
        <div className="input-group">
          <TextField
            type="text"
            name="search"
            onChange={(e) => setSearchQuery(e.target.value)}
            label="Search..."
          />
        </div>
        <div className="mt-3">
          <InputLabel>Duration</InputLabel>
          <Select
            onChange={(e) => {
              handleFilterChange(e);
            }}
            fullWidth
          >
            <MenuItem>
              {" "}
              <em>None</em>
            </MenuItem>
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
            <MenuItem value="3">3</MenuItem>
            <MenuItem value="4">4</MenuItem>
            <MenuItem value="5">5</MenuItem>
            <MenuItem value="6">6</MenuItem>
          </Select>
        </div>
      </div>

      <div className="px-5 py-3">
        <div className="mb-3" style={{ padding: "16px", margin: "auto" }}>
          {(filterCourses(courses) || search(courses)) && (
            <h2 className="mb-3">Search Results</h2>
          )}
          {/* {filterCourses(courses)&&(<h2>Search Results</h2>)} */}
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {filterCourses(courses) &&
              filterCourses(courses).map((dataObj) => {
                return (
                  <div className="col">
                    <div className="card mb-3 m-auto">
                      <div className="">
                        <img
                          className="card-img"
                          src={courseImage}
                          alt="Card cap"
                        ></img>
                        <div className="card-body text-left">
                          <h5>{dataObj.course_name}</h5>
                          <h6>Certificate</h6>
                          <h6>Description: {dataObj.description}</h6>
                          <h6> Duration : {dataObj.duration_months} months</h6>
                          <button
                            className="btn btn-success"
                            onClick={() => enrollCourse(dataObj.course_id)}
                          >
                            Enroll
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          <Grid container spacing={4} mt={3}>
            {search(courses) &&
              search(courses).map((dataObj) => {
                return (
                  <Grid key={dataObj.course_id} item lg={3.8} sm={6} xs={12}>
                    <Grid
                      container
                      direction="column"
                      alignItems="start"
                      spacing={2}
                    >
                      <img
                        className="card-img"
                        src={courseImage}
                        alt="Card cap"
                      ></img>
                      <div className="card-body text-left">
                        <h4 className="card-title">
                          Course ID: {dataObj.course_id}
                        </h4>

                        <h5>{dataObj.course_name}</h5>
                        <h6>Certificate</h6>
                        <h6>Description: {dataObj.description}</h6>
                        <h6> Duration : {dataObj.duration_months} months</h6>
                        <button
                          className="btn btn-success "
                          onClick={() => enrollCourse(dataObj.course_id)}
                        >
                          Enroll
                        </button>
                      </div>
                    </Grid>
                  </Grid>
                  // </div>
                  // </div>
                );
              })}
          </Grid>
        </div>
        <Grid container direction="column">
          <h1>Courses at Maritime education system</h1>
          <h4 className="headline ">
            Explore new and Advanced courses to begin your journey.
          </h4>
        </Grid>
        <Grid container spacing={4} mt={3}>
          {courses.map((course, ind) => {
            return (
              <Grid item key={ind} lg={3.8} sm={6} xs={12}>
                <Grid
                  container
                  direction="column"
                  alignItems="start"
                  spacing={2}
                >
                  <img
                    className="card-img"
                    src={courseImage}
                    alt="Card cap"
                  ></img>
                  <div className="card-body">
                    <h5>{course.course_name}</h5>
                    <h6>Certificate</h6>
                    <h6>Description: {course.description}</h6>
                    <h6> Duration : {course.duration_months} months</h6>
                    <button
                      className="btn btn-success"
                      onClick={() => enrollCourse(course.course_id)}
                    >
                      Enroll
                    </button>
                  </div>
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      </div>

      <div className="mb-3"></div>
    </div>
  );
}
