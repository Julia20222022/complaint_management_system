import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import ComplaintList from '../components/ComplaintList';

export default function StaffComplaints() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  const firstName = (user?.name || user?.email || 'Staff').split(' ')[0];

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get('/api/complaints', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setComplaints(data);
      } catch {
        alert('Failed to fetch all complaints (staff only).');
      }
    })();
  }, [user]);

  const filteredComplaints = statusFilter
    ? complaints.filter((c) => (c.status || 'open') === statusFilter)
    : complaints;

  return (
    <div className="min-h-screen bg-[#FAF3E0] text-[#6B8F71]">
      <div className="container mx-auto p-6 space-y-6">
        <div className="rounded border border-[#A3B18A]/40 bg-white/70 p-5">
          <p className="text-2xl font-bold">{firstName} Assigned Complaints</p>
        </div>

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
          setEditingComplaint={() => {}}
          showUpdate={false}
        />
      </div>
    </div>
  );
}
