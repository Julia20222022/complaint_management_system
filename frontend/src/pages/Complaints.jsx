import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import ComplaintForm from '../components/ComplaintForm';
import ComplaintList from '../components/ComplaintList';
import { useAuth } from '../context/AuthContext';

const Complaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axiosInstance.get('/api/complaints/my', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setComplaints(response.data);
      } catch (error) {
        alert('Failed to fetch complaints.');
      }
    };

    fetchComplaints();
  }, [user]);

  const filteredComplaints = statusFilter
    ? complaints.filter((c) => (c.status || 'open') === statusFilter)
    : complaints;
      
  return (
    <div className="container mx-auto p-6">  
      <ComplaintForm
        complaints={complaints}
        setComplaints={setComplaints}
        editingComplaint={editingComplaint}
        setEditingComplaint={setEditingComplaint}
      />
      <h1 className="text-2xl font-bold mb-4 text-[#6B8F71]">My Complaints</h1>
      <div className="mb-4 flex items-center gap-3">
        <label className="text-[#6B8F71] font-medium">Filter by status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All</option>
          <option value="open">Submitted</option>
          <option value="in-progress">In progress</option>
          <option value="closed">Resolved</option>
        </select>
      </div>
    
      <ComplaintList 
        complaints={filteredComplaints} 
        setComplaints={setComplaints} 
        setEditingComplaint={setEditingComplaint} 
        />
    </div>
  );
};

export default Complaints;

