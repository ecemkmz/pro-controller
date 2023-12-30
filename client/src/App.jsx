import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login/Login"
import SignUp from "./components/signup/SignUp"
import Sidebar from './components/sidebar/Sidebar';
import Employees from './components/employees/Employees';
import Home from './pages/home/Home';
import UserEdit from "./components/userEdit/userEdit";
function App() {
  return (
    <BrowserRouter>
      <Routes>
       <Route path="/sidebar" element={<Sidebar/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/" element={<Home />} />
        <Route path="/userEdit" element={<UserEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;