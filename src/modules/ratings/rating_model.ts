import mongoose from 'mongoose';

export interface IRating {
    combat: mongoose.Schema.Types.ObjectId;
    from: mongoose.Schema.Types.ObjectId;
    to: mongoose.Schema.Types.ObjectId;
    score: number;
    comment?: string;
    createdAt?: Date;
    }  

const ratingSchema = new mongoose.Schema({
  combat: { type: mongoose.Schema.Types.ObjectId, ref: 'Combat', required: true },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Rating', ratingSchema);