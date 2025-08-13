import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ComplaintForm = ({ complaints, setComplaints, editingComplaint, setEditingComplaint }) => {
  const { user } = useAuth();

  const emptyForm = {
    userName: '', 
    emailAddress: '', 
    incidentDate: '', 
    natureOfComplaint: '', 
    desiredOutcome: '', 
    consentToFollowUp: false, 
    status: 'open', };

    const [formData, setFormData] = useState(emptyForm); 

  useEffect(() => {
    if (editingComplaint) {
      setFormData({
      userName: editingComplaint.userName || '', 
      emailAddress: editingComplaint.emailAddress || '', 
      incidentDate: editingComplaint.incidentDate
      ? new Date(editingComplaint.incidentDate).toISOString().slice(0, 10)
      : '', 
      natureOfComplaint: editingComplaint.natureOfComplaint ||'', 
      desiredOutcome: editingComplaint.desiredOutcome || '', 
      consentToFollowUp: 
        typeof editingComplaint.consentToFollowUp === 'boolean'
        ? editingComplaint.consentToFollowUp
        : false, 
      status: editingComplaint.status || 'open', });
    } else {
      setFormData ({
        userName: '', 
        emailAddress: '', 
        incidentDate: '', 
        natureOfComplaint: '', 
        desiredOutcome: '', 
        consentToFollowUp: false, 
        status: 'open', });
    }
  }, [editingComplaint]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const headers = { Authorization: 'Bearer ${user.token'};
      if (editingComplaint) {
        const response = await axiosInstance.put(`/api/complaints/${editingComplaint._id}`, formData, {
          headers //: { Authorization: `Bearer ${user.token}` },
        });
        setComplaints(complaints.map((complaint) => (complaint._id === response.data._id ? response.data : complaint)));
      } else {
        const response = await axiosInstance.post('/api/complaints', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setComplaints([...complaints, response.data]);
      }

      setEditingComplaint(null);

      setFormData({ userName: '', emailAddress: '', incidentDate: '', natureOfComplaint: '', desiredOutcome: '', consentToFollowUp: false, status: 'open', });
    } catch (error) {
      alert('Failed to save complaint.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingComplaint ? 'Edit Complaint' : 'Complaint Submission Form'}</h1>
      
      <input
        type="text"
        placeholder="Your Name"
        value={formData.userName}
        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      <input
        type="email"
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

  <p className="mb-4">
      Consent to follow up:
      <label className="m1-2 mr-4 inline-flex items-center">
        <input
        type="radio"
        name="consentToFollowUp"
        value="true"
        checked={formData.consentToFollowUp === 'true'}
        onChange={(e) => setFormData({ ...formData, consentToFollowUp: e.target.value === 'true' })}
    />

      <span className="m1-1">Yes</span>
       </label>
       <label className="inline-flex items-center">
        <input
        type="radio"
        name="consentToFollowUp"
        value="false"
        checked={formData.consentToFollowUp === 'false'}
        onChange={(e) => setFormData({ ...formData, consentToFollowUp: e.target.value ==='false' })}
    />
      <span className="m1-1">No</span>
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
