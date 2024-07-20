import "../css/courses.css";

import { useState, useEffect } from "react";
import axios from "axios";
import programImage from "../assets/images.jpg";
import React from "react";
import ProgramBanner from "../assets/598198350abe8-page-banners6.jpg";
import { API_URL } from "../utils";
import SearchIcon from "@mui/icons-material/Search";
import qs from "qs";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
export default function Programs() {
  const stdID = localStorage.getItem("std_id");
  const [programs, setPrograms] = useState([]);
  const [searchQuery, setSearchQuery] = useState([]);
  const [filterQuery, setFilterQuery] = useState();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  function handleFilterChange(e) {
    setFilterQuery(e.target.value);
    console.log("filter", filterQuery);
  }
  function filterPrograms(data) {
    if (filterQuery) {
      console.log(filterQuery, "filter query");
      console.log("data", data);
      console.log(
        data.filter((obj) => {
          return obj.duration_months === parseInt(filterQuery);
        })
      );
      return data.filter((obj) => {
        return obj.duration_months === parseInt(filterQuery);
      });
    }
  }
  function search(data) {
    if (searchQuery.length > 1)
      return data.filter((program) =>
        program.program_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }

  const enrollProgram = async (id) => {
    if (!stdID) {
      navigate("/login");
    } else {
      let data = qs.stringify({
        AppDate: new Date().toISOString().slice(0, 19).replace("T", " "),
        Status: '"pending"',
        course_id: "null",
        program_id: id,
        std_id: stdID,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${API_URL}/apply_for_program`,
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
            toast.success("Program enrolled successfully");
          }
        })
        .catch((error) => {
          console.log(error);
        });
      console.log(response);
    }
  };
  const fetchData = async () => {
    if (stdID) {
      const response = await axios.get(`${API_URL}/get_all_programs`);
      if (response.status === 200) {
        console.log(response.data.data);
        const all_programs = response.data.data;
        const programsToRemove = await filterunAppliedPrograms();
        const filteredPrograms = all_programs.filter((program) => {
          // Check if course_id in any object of coursesToRemove matches the current course
          return !programsToRemove.some(
            (programToRemove) =>
              programToRemove.program_id === program.program_id
          );
        });
        console.log(filteredPrograms);
        setPrograms(filteredPrograms);
      }
    } else {
      try {
        const response = await axios.get(`${API_URL}/get_all_programs`);
        if (response.status === 200) {
          console.log(response.data.data);
          setPrograms(response.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  async function filterunAppliedPrograms() {
    const response = await axios.get(
      `${API_URL}/program_application_by_std/${stdID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log(response);
    if (response.status === 200) {
      return response.data.data;
    } else {
      return [];
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ minHeight: "100vh" }} id="CourseBanner">
      <div
        className="d-flex flex-column flex-shrink-0 p-3 bg-light sidebar"
        style={{ width: "280px" }}
      >
        <span className="fs-4">Search Programs</span>

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

      <div className="programs p-5">
        <div className="mb-3" style={{ padding: "16px", margin: "auto" }}>
          {(filterPrograms(programs) || search(programs)) && (
            <h2>Search Results</h2>
          )}
          <div className="row row-cols-1 row-cols-md-3 g-4 ">
            {filterPrograms(programs) &&
              filterPrograms(programs).map((dataObj, ind) => {
                return (
                  <div className="col" key={ind}>
                    <div className="card mb-3 m-auto">
                      <div className="">
                        <img
                          className="card-img"
                          src={programImage}
                          alt="Card cap"
                        ></img>
                        <div className="card-body text-left">
                          <h4 className="card-title">
                            Course ID: {dataObj.program_id}
                          </h4>

                          <h5>{dataObj.program_name}</h5>
                          <h6>Description: {dataObj.description}</h6>
                          <h6> Duration : {dataObj.duration_months} months</h6>
                          <button
                            className="btn btn-success "
                            onClick={() => enrollProgram(dataObj.program_id)}
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
          <Grid container spacing={4} mt={3} style={{ padding: "16px" }}>
            {search(programs) &&
              search(programs).map((dataObj, ind) => {
                return (
                  <Grid item lg={3.8} sm={6} xs={12}>
                    <Grid
                      container
                      direction="column"
                      alignItems="start"
                      spacing={2}
                    >
                      <img
                        className="card-img"
                        src={programImage}
                        alt="Card cap"
                      ></img>
                      <div className="card-body text-left">
                        <h4 className="card-title">
                          Program ID: {dataObj.program_id}
                        </h4>

                        <h5>{dataObj.program_name}</h5>
                        <h6>Certificate</h6>
                        <h6>Description: {dataObj.description}</h6>
                        <h6> Duration : {dataObj.duration_months} months</h6>
                        <button
                          className="btn btn-success "
                          onClick={() => enrollProgram(dataObj.program_id)}
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
        <h1 className="text-center" style={{ textAlign: "center" }}>
          Training Programs At Maritime Education System
        </h1>
        <h4 className="headline">
          Explore new and Advanced Training Programs to upskill your Career.
        </h4>

        <Grid container spacing={4} mt={3}>
          {programs.map((program, index) => (
            <Grid key={program.program_id} item lg={3.8} sm={6} xs={12}>
              <Grid
                container
                direction="column"
                alignItems="start"
                spacing={2}
                className="card mb-3"
              >
                <div className="">
                  <img
                    className="card-img"
                    src={programImage}
                    alt="Card  cap"
                  ></img>
                  <div className="card-body">
                    <h5>Program Name: {program.program_name}</h5>
                    <h6>Duration: {program.duration_months} months</h6>
                    <h6>Trainer {program.trainer}</h6>
                    <h6>Description</h6>

                    <p className="card-text">{program.description}</p>
                    <button
                      onClick={() => {
                        enrollProgram(program.program_id);
                      }}
                      className="btn btn-success"
                    >
                      Enroll
                    </button>
                  </div>
                </div>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </div>
      <div className="mb-3"></div>
    </div>
  );
}
