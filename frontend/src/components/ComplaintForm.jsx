import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ComplaintForm = ({ complaints, setComplaints, editingComplaint, setEditingComplaint }) => {
  const { user } = useAuth();
  const MAX_CHARS = 500;

  const emptyForm = {
    userName: '',
    emailAddress: '',
    incidentDate: '',
    natureOfComplaint: '',
    desiredOutcome: '',
    consentToFollowUp: false,
    status: 'open',
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (editingComplaint) {
      setFormData({
        userName: editingComplaint.userName || '',
        emailAddress: editingComplaint.emailAddress || '',
        incidentDate: editingComplaint.incidentDate
          ? new Date(editingComplaint.incidentDate).toISOString().slice(0, 10)
          : '',
        natureOfComplaint: editingComplaint.natureOfComplaint || '',
        desiredOutcome: editingComplaint.desiredOutcome || '',
        consentToFollowUp:
          typeof editingComplaint.consentToFollowUp === 'boolean'
            ? editingComplaint.consentToFollowUp
            : false,
        status: editingComplaint.status || 'open',
      });
    } else {
      setFormData(emptyForm);
    }
  }, [editingComplaint]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${user.token}` };

      if (editingComplaint) {
        const response = await axiosInstance.put(
          `/api/complaints/${editingComplaint._id}`,
          formData,
          { headers }
        );
        setComplaints(
          complaints.map((complaint) =>
            complaint._id === response.data._id ? response.data : complaint
          )
        );
      } else {
        const response = await axiosInstance.post('/api/complaints', formData, {
          headers,
        });
        setComplaints([...complaints, response.data]);
      }

      setEditingComplaint(null);
      setFormData(emptyForm);
    } catch (error) {
      alert('Failed to save complaint.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#FAF3E0] p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4 text-[#6B8F71]">
        {editingComplaint ? 'Edit Complaint' : 'Complaint Submission Form'}
      </h1>

      <label htmlFor="userName" className="block mb-1 text-[#6B8F71] font-medium">
        Your Name
      </label>
      <input
        id="userName"
        type="text"
        value={formData.userName}
        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <label htmlFor="emailAddress" className="block mb-1 text-[#6B8F71] font-medium">
        Email Address
      </label>
      <input
        id="emailAddress"
        type="email"
        value={formData.emailAddress}
        onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <label htmlFor="incidentDate" className="block mb-1 text-[#6B8F71] font-medium">
        Incident Date
      </label>
      <input
        id="incidentDate"
        type="date"
        value={formData.incidentDate}
        onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      <label htmlFor="natureOfComplaint" className="block mb-1 text-[#6B8F71] font-medium">
        Nature of Complaint
      </label>
      <textarea
        id="natureOfComplaint"
        rows={5}
        maxLength={MAX_CHARS}
        value={formData.natureOfComplaint}
        onChange={(e) => setFormData({ ...formData, natureOfComplaint: e.target.value })}
        className="w-full mb-1 p-2 border rounded"
        required
      />
      <div className="text-right text-sm text-gray-500 mb-4">
        {formData.natureOfComplaint.length}/{MAX_CHARS}
      </div>

      <label htmlFor="desiredOutcome" className="block mb-1 text-[#6B8F71] font-medium">
        Desired Outcome
      </label>
      <textarea
        id="desiredOutcome"
        rows={5}
        maxLength={MAX_CHARS}
        value={formData.desiredOutcome}
        onChange={(e) => setFormData({ ...formData, desiredOutcome: e.target.value })}
        className="w-full mb-1 p-2 border rounded"
      />
      <div className="text-right text-sm text-gray-500 mb-4">
        {formData.desiredOutcome.length}/{MAX_CHARS}
      </div>

      <p className="mb-4 text-[#6B8F71] font-medium">
        Consent to follow up:
        <label className="ml-2 mr-4 inline-flex items-center font-normal">
          <input
            type="radio"
            name="consentToFollowUp"
            value="true"
            checked={formData.consentToFollowUp === true}
            onChange={() => setFormData({ ...formData, consentToFollowUp: true })}
          />
          <span className="ml-1">Yes</span>
        </label>
        <label className="inline-flex items-center font-normal">
          <input
            type="radio"
            name="consentToFollowUp"
            value="false"
            checked={formData.consentToFollowUp === false}
            onChange={() => setFormData({ ...formData, consentToFollowUp: false })}
          />
          <span className="ml-1">No</span>
        </label>
      </p>

      <button type="submit" className="w-full bg-[#A3B18A] text-white p-2 rounded">
        {editingComplaint ? 'Update Complaint' : 'Submit Complaint'}
      </button>
    </form>
  );
};

export default ComplaintForm;
