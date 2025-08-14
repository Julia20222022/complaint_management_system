import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const homeHref = user?.role === 'staff' ? '/staff' : '/general';

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to={homeHref} className="text-2xl font-bold">Complaint Submission Form</Link>
      <div>
        {user ? (
          <>
            {user.role === 'staff' && (
              <>
                <Link to="/staff" className="mr-4">Dashboard</Link>
                <Link to="/staff/complaints" className="mr-4">Complaints</Link>
              </>
            )}
            <Link to="/complaints" className="mr-4">CRUD</Link>
            <Link to="/profile" className="mr-4">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link
              to="/register"
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
