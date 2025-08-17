
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const http = require('http');
// const app = require('../server'); 
// const connectDB = require('../config/db');
// const mongoose = require('mongoose');
// const sinon = require('sinon');
// const Complaint = require('../models/Complaint');
// const { updateComplaint,getComplaints,addComplaint,deleteComplaint, getMyComplaints } = require('../controllers/complaintController');
// const { expect } = chai;

// chai.use(chaiHttp);
// let server;
// let port;


// describe('AddComplaint Function Test', () => {

//   it('should create a new complaint successfully', async () => {
//     // Mock request data
//     const req = {
//       user: { id: new mongoose.Types.ObjectId() },
//       body: { title: "New Complaint", description: "Complaint description", deadline: "2025-12-31" }
//     };

//     // Mock complaint that would be created
//     const createdComplaint = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };

//     // Stub Complaint.create to return the createdComplaint
//     const createStub = sinon.stub(Complaint, 'create').resolves(createdComplaint);

//     // Mock response object
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.spy()
//     };

//     // Call function
//     await addComplaint(req, res);

//     // Assertions
//     expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
//     expect(res.status.calledWith(201)).to.be.true;
//     expect(res.json.calledWith(createdComplaint)).to.be.true;

//     // Restore stubbed methods
//     createStub.restore();
//   });

//   it('should return 500 if an error occurs', async () => {
//     // Stub Complaint.create to throw an error
//     const createStub = sinon.stub(Complaint, 'create').throws(new Error('DB Error'));

//     // Mock request data
//     const req = {
//       user: { id: new mongoose.Types.ObjectId() },
//       body: { title: "New Complaint", description: "Complaint description", deadline: "2025-12-31" }
//     };

//     // Mock response object
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.spy()
//     };

//     // Call function
//     await addComplaint(req, res);

//     // Assertions
//     expect(res.status.calledWith(500)).to.be.true;
//     expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

//     // Restore stubbed methods
//     createStub.restore();
//   });

// });


// describe('Update Function Test', () => {

//   it('should update complaint successfully', async () => {
//     // Mock complaint data
//     const complaintId = new mongoose.Types.ObjectId();
//     const existingComplaint = {
//       _id: complaintId,
//       title: "Old Complaint",
//       description: "Old Description",
//       completed: false,
//       deadline: new Date(),
//       save: sinon.stub().resolvesThis(), // Mock save method
//     };
//     // Stub Complaint.findById to return mock complaint
//     const findByIdStub = sinon.stub(Complaint, 'findById').resolves(existingComplaint);

//     // Mock request & response
//     const req = {
//       params: { id: complaintId },
//       body: { title: "New Complaint", completed: true }
//     };
//     const res = {
//       json: sinon.spy(), 
//       status: sinon.stub().returnsThis()
//     };

//     // Call function
//     await updateComplaint(req, res);

//     // Assertions
//     expect(existingComplaint.title).to.equal("New Complaint");
//     expect(existingComplaint.completed).to.equal(true);
//     expect(res.status.called).to.be.false; // No error status should be set
//     expect(res.json.calledOnce).to.be.true;

//     // Restore stubbed methods
//     findByIdStub.restore();
//   });



//   it('should return 404 if complaint is not found', async () => {
//     const findByIdStub = sinon.stub(Complaint, 'findById').resolves(null);

//     const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.spy()
//     };

//     await updateComplaint(req, res);

//     expect(res.status.calledWith(404)).to.be.true;
//     expect(res.json.calledWith({ message: 'Complaint not found' })).to.be.true;

//     findByIdStub.restore();
//   });

//   it('should return 500 on error', async () => {
//     const findByIdStub = sinon.stub(Complaint, 'findById').throws(new Error('DB Error'));

//     const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.spy()
//     };

//     await updateComplaint(req, res);

//     expect(res.status.calledWith(500)).to.be.true;
//     expect(res.json.called).to.be.true;

//     findByIdStub.restore();
//   });



// });



// describe('GetComplaint Function Test', () => {

//   it('should return complaints for the given user', async () => {
//     // Mock user ID
//     const userId = new mongoose.Types.ObjectId();

//     // Mock complaint data
//     const complaints = [
//       { _id: new mongoose.Types.ObjectId(), title: "Complaint 1", userId },
//       { _id: new mongoose.Types.ObjectId(), title: "Complaint 2", userId }
//     ];

//     // Stub Complaint.find to return mock complaints
//     const findStub = sinon.stub(Complaint, 'find').resolves(complaints);

//     // Mock request & response
//     const req = { user: { id: userId } };
//     const res = {
//       json: sinon.spy(),
//       status: sinon.stub().returnsThis()
//     };

//     // Call function
//     await getComplaints(req, res);

//     // Assertions
//     expect(findStub.calledOnceWith({ userId })).to.be.true;
//     expect(res.json.calledWith(complaints)).to.be.true;
//     expect(res.status.called).to.be.false; // No error status should be set

//     // Restore stubbed methods
//     findStub.restore();
//   });

//   it('should return 500 on error', async () => {
//     // Stub Complaint.find to throw an error
//     const findStub = sinon.stub(Complaint, 'find').throws(new Error('DB Error'));

//     // Mock request & response
//     const req = { user: { id: new mongoose.Types.ObjectId() } };
//     const res = {
//       json: sinon.spy(),
//       status: sinon.stub().returnsThis()
//     };

//     // Call function
//     await getComplaints(req, res);

//     // Assertions
//     expect(res.status.calledWith(500)).to.be.true;
//     expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

//     // Restore stubbed methods
//     findStub.restore();
//   });

// });



// describe('DeleteComplaint Function Test', () => {

//   it('should delete a complaint successfully', async () => {
//     // Mock request data
//     const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

//     // Mock complaint found in the database
//     const complaint = { remove: sinon.stub().resolves() };

//     // Stub Complaint.findById to return the mock complaint
//     const findByIdStub = sinon.stub(Complaint, 'findById').resolves(complaint);

//     // Mock response object
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.spy()
//     };

//     // Call function
//     await deleteComplaint(req, res);

//     // Assertions
//     expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
//     expect(complaint.remove.calledOnce).to.be.true;
//     expect(res.json.calledWith({ message: 'Complaint deleted' })).to.be.true;

//     // Restore stubbed methods
//     findByIdStub.restore();
//   });

//   it('should return 404 if complaint is not found', async () => {
//     // Stub Complaint.findById to return null
//     const findByIdStub = sinon.stub(Complaint, 'findById').resolves(null);

//     // Mock request data
//     const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

//     // Mock response object
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.spy()
//     };

//     // Call function
//     await deleteComplaint(req, res);

//     // Assertions
//     expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
//     expect(res.status.calledWith(404)).to.be.true;
//     expect(res.json.calledWith({ message: 'Complaint not found' })).to.be.true;

//     // Restore stubbed methods
//     findByIdStub.restore();
//   });

//   it('should return 500 if an error occurs', async () => {
//     // Stub Complaint.findById to throw an error
//     const findByIdStub = sinon.stub(Complaint, 'findById').throws(new Error('DB Error'));

//     // Mock request data
//     const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

//     // Mock response object
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.spy()
//     };

//     // Call function
//     await deleteComplaint(req, res);

//     // Assertions
//     expect(res.status.calledWith(500)).to.be.true;
//     expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

//     // Restore stubbed methods
//     findByIdStub.restore();
//   });

// });