import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ComplaintForm = ({ complaints, setComplaints, editingComplaint, setEditingComplaint }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ 
    userName: '', 
    emailAddress: '', 
    incidentDate: '', 
    natureOfComplaint: '', 
    desiredOutcome: '', 
    consentToFollowUp: '', 
    status: '', });

  useEffect(() => {
    if (editingComplaint) {
      setFormData({
      userName: editingComplaint.userName, 
      emailAddress: editingComplaint.emailAddress, 
      incidentDate: editingComplaint.incidentDate, 
      natureOfComplaint: editingComplaint.natureOfComplaint, 
      desiredOutcome: editingComplaint.desiredOutcome, 
      consentToFollowUp: editingComplaint.consentToFollowUp, 
      status: editingComplaint.status, });
    } else {
      setFormData({ 
        userName: '', 
        emailAddress: '', 
        incidentDate: '', 
        natureOfComplaint: '', 
        desiredOutcome: '', 
        consentToFollowUp: '', 
        status: '', });
    }
  }, [editingComplaint]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingComplaint) {
        const response = await axiosInstance.put(`/api/complaints/${editingComplaint._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setComplaints(complaints.map((complaint) => (complaint._id === response.data._id ? response.data : complaint)));
      } else {
        const response = await axiosInstance.post('/api/complaints', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setComplaints([...complaints, response.data]);
      }
      setEditingComplaint(null);

      setFormData({ userName: '', emailAddress: '', incidentDate: '', natureOfComplaint: '', desiredOutcome: '', consentToFollowUp: '', status: '', });
    } catch (error) {
      alert('Failed to save complaint.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingComplaint ? 'Your Form Name: Edit Operation' : 'Complaint Submission Form'}</h1>
      <input
        type="text"

        placeholder="Your Name"
        value={formData.userName}
        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Email Address"
        value={formData.emailAddress}
        onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="date"
        placeholder="Incident Date"
        value={formData.incidentDate}
        onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Nature of Complaint"
        value={formData.natureOfComplaint}
        onChange={(e) => setFormData({ ...formData, natureOfComplaint: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Desired Outcome"
        value={formData.desiredOutcome}
        onChange={(e) => setFormData({ ...formData, desiredOutcome: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

  <p>
      Consent to follow up:
      <label>
        <input
        type="radio"
        name="consentToFollowUp"
        value="Yes"
        checked={formData.consentToFollowUp === 'Yes'}
        onChange={(e) => setFormData({ ...formData, consentToFollowUp: e.target.value })}
    />
      Yes
       </label>
       <label>
        <input
        type="radio"
        name="consentToFollowUp"
        value="No"
        checked={formData.consentToFollowUp === 'No'}
        onChange={(e) => setFormData({ ...formData, consentToFollowUp: e.target.value })}
    />
      No
    </label>
    </p>



       <br></br>
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingComplaint ? 'Update Button' : 'Submit'}
      </button>
    </form>
  );
};

export default ComplaintForm;
