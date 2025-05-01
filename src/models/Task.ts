import mongoose, { Document, Schema } from 'mongoose';


export interface ITask extends Document {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: Date;
  assignedTo: String;
  createdBy: string;
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
    assignedTo: { type: String, ref: 'User' },
    createdBy: { type: String, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model<ITask>('Task', taskSchema);