import "./App.css";

import { Routes, Route, BrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";

// const {Login} from './components/login.js'
import Loading from "./components/loading";
import { ToastContainer } from "react-toastify";
const JobPortal = lazy(() => delayForDemo(import("./components/job_portal")));
const JobSearch = lazy(() => delayForDemo(import("./components/search_jobs")));
const JobSeekerPortal = lazy(() =>
  delayForDemo(import("./components/job_seeker_portal"))
);
const JobApplications = lazy(() =>
  delayForDemo(import("./components/job_applications"))
);
const JobSeekerProfile = lazy(() =>
  delayForDemo(import("./components/jobseeker_profile"))
);
const AppliedJobs = lazy(() =>
  delayForDemo(import("./components/applied_jobs"))
);
const ManageJobs = lazy(() => delayForDemo(import("./components/manage_jobs")));
const AdminPage = lazy(() => delayForDemo(import("./components/admin_portal")));
// const AdminMessages = lazy(() => delayForDemo(import("./components/messages")));
const StudentPortal = lazy(() =>
  delayForDemo(import("./components/student_portal"))
);
const MyCoursesAndPrograms = lazy(() =>
  delayForDemo(import("./components/my_courses_and_programs"))
);
const StudentsList = lazy(() =>
  delayForDemo(import("./components/students_list"))
);
const Home = lazy(() => delayForDemo(import("./components/home")));
const Signup = lazy(() => delayForDemo(import("./components/signup")));
const Programs = lazy(() =>
  delayForDemo(import("./components/training_programs"))
);
const ProgramInfo = lazy(() =>
  delayForDemo(import("./components/program_page"))
);
const Profile = lazy(() => delayForDemo(import("./components/profile")));
const EmployerPortal = lazy(() =>
  delayForDemo(import("./components/employer_portal"))
);
const EmployerProfile = lazy(() =>
  delayForDemo(import("./components/employer_profile"))
);
const EmployersList = lazy(() =>
  delayForDemo(import("./components/employers_list"))
);
const Navbar = lazy(() => delayForDemo(import("./components/navbar")));
const CoursesAndProgramsManagement = lazy(() =>
  delayForDemo(import("./components/courses&program_management"))
);
const CoursesList = lazy(() =>
  delayForDemo(import("./components/courses_list"))
);
const Footer = lazy(() => delayForDemo(import("./components/footer")));
const AdminNotifications = lazy(() =>
  delayForDemo(import("./components/notifications"))
);
const CourseInfo = lazy(() => delayForDemo(import("./components/course_page")));
const PageNotFound = lazy(() => import("./components/pagenotfound"));
const Login = lazy(() => import("./components/login"));
const PostJob = lazy(() => import("./components/post_a_job"));
const ClientMessages = lazy(() =>
  delayForDemo(import("./components/user_messages"))
);
const ResetPassword = lazy(() =>
  delayForDemo(import("./components/reset_password"))
);
const ResetLink = lazy(() => delayForDemo(import("./components/reset_link")));
function delayForDemo(promise) {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  }).then(() => promise);
}
// const Loading = lazy(() => import("./components/loading"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <BrowserRouter>
        <div className="App" style={{ minHeight: "100vh" }}>
          <ToastContainer autoClose={2000} />
          <Navbar />

          <Routes>
            {/* <Route path="/loading" element={<Loading />} /> */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot_password" element={<ResetLink />} />
            <Route path="/reset_password?" element={<ResetPassword />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/manage_jobs" element={<ManageJobs />} />
            <Route path="/employers_list" element={<EmployersList />} />
            <Route path="/students_list" element={<StudentsList />} />
            <Route
              path="/programs&courses_management"
              element={<CoursesAndProgramsManagement />}
            />
            <Route path="/jobs" element={<JobPortal />} />
            <Route path="/search_jobs" element={<JobSearch />} />
            <Route path="/jobseeker" element={<JobSeekerPortal />} />
            <Route path="/job_applications" element={<JobApplications />} />
            <Route path="/jobseeker_profile" element={<JobSeekerProfile />} />
            <Route path="/applied_jobs" element={<AppliedJobs />} />
            <Route path="/student" element={<StudentPortal />} />
            <Route
              path="/my_course&programs"
              element={<MyCoursesAndPrograms />}
            />
            <Route path="/courses_list" element={<CoursesList />} />
            <Route path="/course_info/:id" element={<CourseInfo />} />
            <Route path="/program_info/:id" element={<ProgramInfo />} />

            <Route path="/programs" element={<Programs />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/employer" element={<EmployerPortal />} />
            <Route path="/post_job" element={<PostJob />} />
            <Route path="/employer_profile" element={<EmployerProfile />} />
            <Route
              path="/admin_notifications"
              element={<AdminNotifications />}
            />
            {/* <Route path='/messages_page' element={<AdminMessages/>} /> */}
            <Route path="/user_messages" element={<ClientMessages />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
           <Footer />
        </div>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
