import mongoose, { Document, Schema } from 'mongoose';


export interface ITask extends Document {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: Date;
  assignedTo: mongoose.Schema.Types.ObjectId;
  createdBy: mongoose.Schema.Types.ObjectId;
}

const taskSchema = new Schema<ITask>(
  {
    _id: {
      type: String,
      default: () => `ta_${new mongoose.Types.ObjectId()}`
    },
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    dueDate: { type: Date },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model<ITask>('Task', taskSchema);