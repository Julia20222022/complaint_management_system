

// Get Complaint Function (Read):
//Staff
const Complaint = require('../models/Complaint');
const getComplaints = async (req, res) => {
  try {
    if (req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Only staff can view all complaints' });
    }
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//User
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Complaint:
const addComplaint = async (req, res) => {
  const { userName, emailAddress, incidentDate, natureOfComplaint, desiredOutcome, consentToFollowUp } = req.body;
  try {
    const complaint = await Complaint.create({ userId: req.user.id, userName, emailAddress, incidentDate, natureOfComplaint, desiredOutcome, consentToFollowUp });
    res.status(201).json(complaint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update Complaint:
const updateComplaint = async (req, res) => {
  const { userName, emailAddress, incidentDate, natureOfComplaint, desiredOutcome, consentToFollowUp, status } = req.body;
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    if (req.user.role !== 'staff' && complaint.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not allowed to edit this complaint' });
    }

    complaint.userName = userName || complaint.userName;
    complaint.emailAddress = emailAddress || complaint.emailAddress;
    complaint.incidentDate = incidentDate || complaint.incidentDate;
    complaint.natureOfComplaint = natureOfComplaint || complaint.natureOfComplaint;
    complaint.desiredOutcome = desiredOutcome || complaint.desiredOutcome;
    complaint.consentToFollowUp = (typeof consentToFollowUp === 'boolean') ? consentToFollowUp : complaint.consentToFollowUp;
    complaint.status = status || complaint.status;

    const updatedComplaint = await complaint.save();
    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};  

// Delete Complaint:
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    const isStaff = req.user.role === 'staff';
    const isOwner = complaint.userId.toString() === req.user.id.toString();
    if(!isStaff && !isOwner) {
      return res.status(403).json({message:'Not allowed to delete this complaint' });
    }

    await complaint.remove();
    res.json({ message:'Complaint deleted'});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 

module.exports = {getComplaints, getMyComplaints, addComplaint, updateComplaint, deleteComplaint };
