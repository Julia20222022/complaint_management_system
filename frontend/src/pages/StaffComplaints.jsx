import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import ComplaintList from '../components/ComplaintList';

export default function StaffComplaints() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get('/api/complaints/all', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setComplaints(data);
      } catch {
        alert('Failed to fetch all complaints (staff only).');
      }
    })();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#FAF3E0] text-[#6B8F71]">
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">All Complaints</h1>
        <ComplaintList
          complaints={complaints}
          setComplaints={setComplaints}
          setEditingComplaint={() => {}}
        />
      </div>
    </div>
  );
}
