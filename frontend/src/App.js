import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Complaints from './pages/Complaints';
import StaffDashboard from './pages/StaffDashboard';
import GeneralDashboard from './pages/GeneralDashboard';
import StaffComplaints from './pages/StaffComplaints';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/general" element={<GeneralDashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/staff/complaints" element={<StaffComplaints />} />
      </Routes>
    </Router>
  );
}

export default App;
