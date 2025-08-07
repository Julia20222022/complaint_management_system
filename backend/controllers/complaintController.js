// Get Complaint Function (Read):

const Complaint = require('../models/Complaint');
const getComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ userId: req.user.id });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Add Complaint Function:

const addComplaint = async (req, res) => {
    const { title, description, deadline } = req.body;
    try {
        const complaint = await Complaint.create({ userId: req.user.id, title, description, deadline });
        res.status(201).json(complaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// Update Complaint:

const updateComplaint = async (req, res) => {
    const { title, description, completed, deadline } = req.body;
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
        complaint.title = title || complaint.title;
        complaint.description = description || complaint.description;
        complaint.completed = completed ?? complaint.completed;
        complaint.deadline = deadline || complaint.deadline;
        const updatedComplaint = await complaint.save();
        res.json(updatedComplaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}  

// Delete Complaint:

const deleteComplaint = async (req, res) => {
 try {
    const complaint = await Complaint.findByld(req.params.id);
    if(!complaint) return res.status(404).json({message:'Task not found'});

    await complaint.remove();
    res.json({ message:'Complaint deleted'});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 

module.exports = {getComplaints, addComplaint, updateComplaint, deleteComplaint };


