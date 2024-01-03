import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login"
import SignUp from "./components/auth/SignUp"
import Employees from './components/employees/Employees';
import Auth from './pages/Auth/Auth';
import ListProjects from './components/projects/ListProjects';
import EmpInfo from './components/employees/EmpInfo';
import Home from './pages/Home/Home';
import ListTasks from './components/tasks/ListTasks';
import Profile from './components/profile/Profile';

function App() {
  return (
    <BrowserRouter>
            <Routes>
              <Route path="/" element={<Auth />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/Home" element={<Home />}>
              <Route path="Employees" element={<Employees />} />
              <Route path="Tasks" element={<ListTasks />} />
              <Route path="Projects" element={<ListProjects />} />
              <Route path="Settings" element={<Profile />} />
              <Route path="Employees/Employee/:empID" element={<EmpInfo />} />
              
        </Route>
              {/* <Route path="/userEdit" element={<UserEdit />} />
              <Route path="/listProjects" element={<ListProjects />} />
              <Route path="/employee/:empID" element={<EmpInfo />} /> */}
              {/* Add other routes as needed */}
            </Routes>
    </BrowserRouter>
  );
}

export default App;
