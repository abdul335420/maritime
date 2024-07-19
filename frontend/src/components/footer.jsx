import { Link, useLocation } from "react-router-dom";
import "../css/footer.css";
import { Grid } from "@mui/material";
export default function Footer() {
  const location = useLocation();
  return (
    location.pathname !== "/login" &&
    location.pathname !== "/signup" && (
      <footer className="py-5 p-5 footer-bg">
        <Grid container>

        <Grid item lg={3} sm={6} xs={12}>
        <Link
          className="navbar-brand d-flex align-items-center fw-bolder fs-2 fst-italic"
          to="/"
        >
          <div className="text-info">Mari</div>
          <div className="text-warning">Time</div>
        </Link>
        </Grid>

          <Grid item lg={3} sm={6} xs={12}>
            <h5>Job Portal</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link to="/jobs" className="nav-link p-0 text-muted">
                  Search Jobs
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/jobseeker" className="nav-link p-0 text-muted">
                  Candidates
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="#" className="nav-link p-0 text-muted">
                  FAQs
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="#" className="nav-link p-0 text-muted">
                  About
                </Link>
              </li>
            </ul>
          </Grid>

          <Grid item lg={3} sm={6} xs={12}>
            <h5>Management</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link to="#" className="nav-link p-0 text-muted">
                  Home
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="#" className="nav-link p-0 text-muted">
                  Employers
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="#" className="nav-link p-0 text-muted">
                  JobSeekers
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="#" className="nav-link p-0 text-muted">
                  Admin
                </Link>
              </li>
            </ul>
          </Grid>

          

          <Grid item lg={3} sm={6} xs={12}>
            <h5>Education</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link to="#" className="nav-link p-0 text-muted">
                  Home
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/signup" className="nav-link p-0 text-muted">
                  signup
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/login" className="nav-link p-0 text-muted">
                  Student login
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/courses_list" className="nav-link p-0 text-muted">
                  Our Courses
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/programs" className="nav-link p-0 text-muted">
                  Our Training programs
                </Link>
              </li>
            </ul>
          </Grid>
        </Grid>
      </footer>
    )
  );
}
