import React from "react";
import "../css/job_portal.css";
import { useState, useEffect } from "react";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../utils";
import { useCallback } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DoneIcon from "@mui/icons-material/Done";
import qs from "qs";
import {
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

export default function Job_Portal() {
  const [myJobs, setmyJobs] = useState([]);
  const [unappliedJobs, setUnappliedJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const user_id = localStorage.getItem("user_id");
  const jobSeeker_id = localStorage.getItem("jobSeeker_id");
  const [jobDetails, setJobDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState([]);
  const token = localStorage.getItem("authToken");
  const [appliedFlag, setAppliedFlag] = useState(false);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [viewJobDescription, setViewJobDescription] = useState(false);

  // const authToken = localStorage.getItem('authToken')

  function search(data) {
    if (searchQuery.length > 1)
      return data.filter((job) =>
        job.job_title.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/jobs`);
      console.log(response);
      if (response.status === 200) {
        setJobs(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  });
  const fetchJobDescription = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/job/` + id);
      if (response.status === 200) {
        console.log(response.data.data);
        setJobDetails(response.data.data);
        setViewJobDescription(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const applyForJob = async (id) => {
    if (!token) {
      navigate("/login");
    } else {
      const res = await axios.get(`${API_URL}/jobseeker/${jobSeeker_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      const resume_url = res.data.data.resumeURL;
      let data = qs.stringify({
        jobSeeker_id: jobSeeker_id,
        job_id: id,
        AppDate: new Date().toISOString().slice(0, 19).replace("T", " "),
        Status: "pending",
        ResumeURL: resume_url,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${API_URL}/create_job_application`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          if (response.status == 201) {
            toast.success("Successfuly applied to job");
            setAppliedFlag(true);
            // setJobDetails([])
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  function filterJobs(data) {
    if (filterQuery) {
      console.log(filterQuery, "filter query");
      console.log("data", data);
      console.log(
        data.filter((obj) => {
          return obj.location.toLowerCase() === filterQuery.toLowerCase();
        })
      );
      return data.filter((obj) => {
        return obj.location.toLowerCase() === filterQuery.toLowerCase();
      });
    }
  }

  const [filterQuery, setFilterQuery] = useState();
  function handleFilterChange(e) {
    setFilterQuery(e.target.value);
    console.log("filter", filterQuery);
    // show only jobs that are not applied by user
  }
  const fetchAppliedJobs = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    try {
      const response = await axios.get(
        `${API_URL}/applied_jobs_by_user/` + jobSeeker_id,
        { headers: myHeaders }
      );
      if (response.status === 200) {
        setmyJobs(response.data.data);
        console.log(response.data.data);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    }
  };
  // filter out data
  function filterAvailableJobs() {
    const appliedJobsIds = myJobs.map((t) => t.job_id);
    console.log(jobs.filter((job) => !appliedJobsIds.includes(job.job_id)));
    setUnappliedJobs(
      jobs.filter((job) => !appliedJobsIds.includes(job.job_id))
    );
  }

  useEffect(() => {
    fetchData();
    fetchAppliedJobs();
  }, []);
  useEffect(() => {
    filterAvailableJobs();
    console.log(unappliedJobs);
  }, [jobs, myJobs]);

  return (
    <div className="">
      <div
        style={{
          padding: "16px",
          background: "#f1f3f7",
          height: "200px",
          margin: "auto",
          marginTop: "auto",
          borderRadius: "5px",
        }}
      >
        <Grid
          container
          gap={3}
          justifyContent="center"
          alignItems="center"
          // className="mb-3 d-flex align-items-center justify-content-center border border-dark"
        >
          <Grid md={5.5} xs={12}>
            <InputLabel>Search Job...</InputLabel>
            <TextField
              fullWidth
              variant="outlined"
              size="large"
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
            />
          </Grid>

          <Grid item md={5.5} xs={12}>
            <InputLabel>Location</InputLabel>
            <Select
              fullWidth
              onChange={(e) => {
                handleFilterChange(e);
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="islamabad">Islamabad</MenuItem>
              <MenuItem value="karachi">Karachi</MenuItem>
              <MenuItem value="lahore">Lahore</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </div>
      <div className=" content-container container">
        <div className="job-listing ">
          <div className="row row-cols-1 mt-3 row-cols-md-2 g-4 w-100">
            {filterJobs(jobs) &&
              filterJobs(jobs).map((dataObj) => {
                return (
                  <div className="">
                    <div className="col filtered-jobs">
                      <div
                        className="card mb-3"
                        key={dataObj.job_id}
                        style={{
                          boxShadow: " 0 4px 8px rgba(0, 0, 0, 0.15)",
                          height: "300px",
                        }}
                      >
                        <div className="card-body">
                          <h5 className="card-title">{dataObj.job_title}</h5>
                          <h6 className="card-subtitle mb-2 text-muted">
                            {dataObj.location}
                          </h6>
                          <hr />
                          <p className="card-text">{dataObj.job_description}</p>
                          <div></div>
                        </div>
                        <p className="text-center">
                          Deadline:{" "}
                          {dataObj.ExpiryDate.toLocaleString()
                            .slice(0, 19)
                            .replace("T", " ")}
                        </p>
                        <Link
                          to="#"
                          onClick={() => {
                            fetchJobDescription(dataObj.job_id);
                          }}
                          style={{ width: "auto" }}
                          className="btn btn-primary m-auto mb-3"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}

            {search(jobs) &&
              search(jobs).map((dataObj) => {
                return (
                  <div className="col search-job-col">
                    <div
                      className="card mb-3"
                      key={dataObj.job_id}
                      style={{
                        boxShadow: " 0 4px 8px rgba(0, 0, 0, 0.15)",
                        height: "300px",
                      }}
                    >
                      <div className="card-body">
                        <h5 className="card-title">{dataObj.job_title}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">
                          {dataObj.location}
                        </h6>
                        <hr />
                        <p className="card-text">{dataObj.job_description}</p>
                      </div>
                      <p className="text-center">
                        Deadline:{" "}
                        {dataObj.ExpiryDate.toLocaleString()
                          .slice(0, 19)
                          .replace("T", " ")}
                      </p>
                      <a
                        href="#"
                        onClick={() => {
                          fetchJobDescription(dataObj.job_id);
                        }}
                        style={{ width: "auto" }}
                        className="btn btn-primary m-auto mb-3"
                      >
                        View
                      </a>
                    </div>
                  </div>
                );
              })}
          </div>
          <hr />
          <br />
          <Grid container spacing={1} mt={3}>
            {unappliedJobs.map((job) => {
              const jobID = job.job_id;
              return (
                <Grid item lg={3.9} sm={6} xs={12} px={2}>
                  <div
                    className="card job-card mb-3"
                    key={job.job_id}
                    style={{
                      boxShadow: " 0 4px 8px rgba(0, 0, 0, 0.15)",
                      height: "300px",
                    }}
                  >
                    <div className="card-body">
                      <h5>{job.job_title}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        {job.location}
                      </h6>
                      <hr />
                      <p className="card-text">{job.job_description}</p>
                    </div>
                    <p className="text-center">
                      Deadline:{" "}
                      {job.ExpiryDate.toLocaleString()
                        .slice(0, 19)
                        .replace("T", " ")}
                    </p>
                    <div className="m-3">
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => {
                          fetchJobDescription(jobID);
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </div>
        <div
          className=" job-description "
          style={{ display: viewJobDescription ? "" : "none" }}
        >
          <div
            className="card job-card mb-3 p-3"
            style={{ width: "100%", float: "left" }}
          >
            <div className="card-body" style={{ textAlign: "left" }}>
              <h1>Job Description</h1>
              <h3 className="card-title">{jobDetails.job_title}</h3>
              <h6 className="card-subtitle mb-2 text-muted">
                <a href="/">Company Name</a>
              </h6>

              <div className="">
                <h5>Pay: </h5>
                <p>{jobDetails && jobDetails.salary} </p>
                <h5>Location: </h5>
                <p>{jobDetails.location}</p>
                <div>
                  <h5>Full Job Description</h5>
                  <div>
                    <p>{jobDetails.job_description}</p>
                    <h5>Requirements</h5>
                    <p className="text-left">{jobDetails.requirements}</p>
                    <h5>Date Posted:</h5>
                    <p>
                      {jobDetails.PostingDate &&
                        jobDetails.PostingDate.toLocaleString()
                          .slice(0, 10)
                          .replace("T", " ")}
                    </p>
                    <h5>Application Deadline :</h5>
                    <p>
                      {jobDetails.ExpiryDate &&
                        jobDetails.ExpiryDate.toLocaleString()
                          .slice(0, 10)
                          .replace("T", " ")}
                    </p>
                    <div className="text-left mb-3">
                      <button
                        className="btn btn-success mr-3"
                        style={{
                          height: "50px",
                          display:
                            !appliedFlag && role !== "employer" ? "" : "none",
                        }}
                        onClick={() => {
                          applyForJob(jobDetails?.job_id);
                        }}
                      >
                        Apply Now
                      </button>
                      <button
                        className="btn btn-success mr-3"
                        style={{
                          height: "50px",
                          display: appliedFlag ? "" : "none",
                        }}
                      >
                        <DoneIcon />
                        Applied
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
