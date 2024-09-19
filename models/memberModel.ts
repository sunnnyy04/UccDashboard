import mongoose, { Schema, model, models } from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  branch: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  image: { type: String,required:true},
  batch: { type: Number, required: true },
  position: { type: String, required: true },
});

// Check if the model exists before defining it
const Member = models.Member || model('Member', memberSchema);

export default Member;
