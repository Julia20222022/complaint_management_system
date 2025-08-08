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
      setFormData({ title: '', description: '', deadline: '' });
    } catch (error) {
      alert('Failed to save complaint.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingComplaint ? 'Your Form Name: Edit Operation' : 'Your Form Name: Create Operation'}</h1>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="date"
        value={formData.deadline}
        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingComplaint ? 'Update Button' : 'Create Button'}
      </button>
    </form>
  );
};

export default ComplaintForm;
