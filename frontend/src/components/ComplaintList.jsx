import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ComplaintList = ({ complaints, setComplaints, setEditingComplaint, showUpdate = true }) => {
  const { user } = useAuth();

  const handleDelete = async (complaintId) => {
    try {
      await axiosInstance.delete(`/api/complaints/${complaintId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setComplaints(complaints.filter((complaint) => complaint._id !== complaintId));
      alert('Complaint deleted.');
    } catch (error) {
      alert('Failed to delete complaint.');
    }
  };

  const handleStatus = async (complaint, nextStatus) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/complaints/${complaint._id}`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setComplaints(complaints.map((c) => (c._id === data._id ? data : c)));
      alert(`Status updated to ${nextStatus}.`);
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to update status.');
    }
  };

  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : '-');

  return (
    <div>
      {complaints.map((complaint, i) => (
        <div key={complaint._id} className="bg-[#FAF3E0] p-6 mb-6 rounded shadow-md">
          <div className="flex justify-between items-start">
            <h2 className="font-bold">Complaint #{i + 1} - {complaint.userName || 'Unnamed'}</h2>

          <div className="flex items-center gap-2">
            <span className="text-sm px-2 py-1 rounded bg-white border">
              {complaint.status || 'open'}
            </span>

              {user?.role === 'staff' && (
                <select
                  value={complaint.status || 'open'}
                  onChange={(e) => handleStatus(complaint, e.target.value)}
                  className="text-sm border rounded p-1 bg-white"
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In progress</option>
                  <option value="closed">Closed</option>
                </select>
              )}
            </div>
          </div>

          <div className="mt-2 text-sm text-gray-700 space-y-1">
            <div><span className="font-semibold">Email:</span> {complaint.emailAddress || '-'}</div>
            <div><span className="font-semibold">Submitted:</span> {fmtDate(complaint.created)}</div>
            <div><span className="font-semibold">Incident date:</span> {fmtDate(complaint.incidentDate)}</div>
            <div><span className="font-semibold">Complaint:</span> {complaint.natureOfComplaint || '-'}</div>
            <div><span className="font-semibold">Desired outcome:</span> {complaint.desiredOutcome || '-'}</div>
            <div><span className="font-semibold">Consent to follow up:</span> {complaint.consentToFollowUp ? 'Yes' : 'No'}</div>
          </div>

          <div className="mt-3 flex gap-2">
            {showUpdate && setEditingComplaint && (
              <button
                onClick={() => setEditingComplaint(complaint)}
                className="bg-amber-300 text-white font-semibold px-4 py-2 rounded"
              >
                Update
              </button>
            )}
            <button
              onClick={() => handleDelete(complaint._id)}
              className="bg-red-400 text-white font-semibold px-4 py-2 rounded"
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
