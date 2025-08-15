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
    <nav className="bg-[#FAF3E0] text-[#6B8F71] p-4 flex justify-between items-center shadow-md">
      <Link to={homeHref} className="text-3xl font-extrabold text-[#6B8F71]">
        Green City Shopping
      </Link>
      <div>
        {user ? (
          <>
            {user.role === 'staff' && (
              <>
                <Link to="/staff" className="mr-4 text-[#6B8F71]">Dashboard</Link>
                <Link to="/staff/complaints" className="mr-4 text-[#6B8F71]">Complaints</Link>
              </>
            )}
            {user.role !== 'staff' && (
              <Link to="/complaints" className="mr-4 text-[#6B8F71]">Submit Complaint</Link>
            )}
            <Link to="/profile" className="mr-4 text-[#6B8F71]">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-[#F87171] text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4 text-[#6B8F71]">Login</Link>
            <Link
              to="/register"
              className="bg-[#A3B18A] text-white px-4 py-2 rounded"
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