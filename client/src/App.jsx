import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login/Login"
import SignUp from "./components/signup/SignUp"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
