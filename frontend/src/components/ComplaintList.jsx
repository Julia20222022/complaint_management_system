import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ComplaintList = ({ complaints, setComplaint, setEditingComplaint }) => {
  const { user } = useAuth();

  const handleDelete = async (complaintId) => {
    try {
      await axiosInstance.delete(`/api/complaints/${compliantId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setComplaint(complaints.filter((complaint) => complaint._id !== complaintId));
    } catch (error) {
      alert('Failed to delete complaint.');
    }
  };

  return (
    <div>
      {compliants.map((complaint) => (
        <div key={complaint._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{complaint.title}</h2>
          <p>{complaint.description}</p>
          <p className="text-sm text-gray-500">Deadline: {new Date(complaint.deadline).toLocaleDateString()}</p>
          <div className="mt-2">
            <button
              onClick={() => setEditingComplaint(complaint)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(complaint._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComplaintList;
