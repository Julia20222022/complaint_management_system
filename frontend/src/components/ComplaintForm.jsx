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
    <form
      onSubmit={handleSubmit}
      className="bg-[#FAF3E0] p-6 shadow-md rounded mb-6"
    >
      <h1 className="text-2xl font-bold mb-4">
        {editingComplaint ? 'Edit Complaint' : 'Complaint Submission Form'}
      </h1>

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
        onChange={(e) =>
          setFormData({ ...formData, emailAddress: e.target.value })
        }
        className="w-full mb-4 p-2 border rounded"
      />

      <input
        type="date"
        value={formData.incidentDate}
        onChange={(e) =>
          setFormData({ ...formData, incidentDate: e.target.value })
        }
        className="w-full mb-4 p-2 border rounded"
      />

      <input
        type="text"
        placeholder="Nature of Complaint"
        value={formData.natureOfComplaint}
        onChange={(e) =>
          setFormData({ ...formData, natureOfComplaint: e.target.value })
        }
        className="w-full mb-4 p-2 border rounded"
      />

      <input
        type="text"
        placeholder="Desired Outcome"
        value={formData.desiredOutcome}
        onChange={(e) =>
          setFormData({ ...formData, desiredOutcome: e.target.value })
        }
        className="w-full mb-4 p-2 border rounded"
      />

      <p className="mb-4">
        Consent to follow up:
        <label className="ml-2 mr-4 inline-flex items-center">
          <input
            type="radio"
            name="consentToFollowUp"
            value="true"
            checked={formData.consentToFollowUp === true}
            onChange={() =>
              setFormData({ ...formData, consentToFollowUp: true })
            }
          />
          <span className="ml-1">Yes</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="consentToFollowUp"
            value="false"
            checked={formData.consentToFollowUp === false}
            onChange={() =>
              setFormData({ ...formData, consentToFollowUp: false })
            }
          />
          <span className="ml-1">No</span>
        </label>
      </p>

      <button
        type="submit"
        className="w-full bg-[#A3B18A] text-white p-2 rounded"
      >
        {editingComplaint ? 'Update Complaint' : 'Submit Complaint'}
      </button>
    </form>
  );
};

export default ComplaintForm;
