
import mongoose, { Schema, Document, models, Model } from 'mongoose';
import type { Report as ReportType } from '@/lib/types'; // Renaming to avoid conflict

export interface IReport extends Document, Omit<ReportType, 'id'> {
  // MongoDB will provide _id, Mongoose virtual 'id' can be used
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema: Schema<IReport> = new Schema(
  {
    timestamp: { type: Number, required: true, index: true },
    symptoms: { type: String, required: true },
    suspectedDisease: { type: String, required: true, index: true },
    patientName: { type: String, required: false },
    patientAge: { type: Number, required: false },
    patientGender: {
      type: String,
      required: false,
      enum: ['male', 'female', 'other', 'not_specified', null], // Allow null if not provided
    },
    location: {
      latitude: { type: Number, required: false },
      longitude: { type: Number, required: false },
      required: false,
      default: null,
    },
    region: { type: String, required: false, index: true },
    isAnonymous: { type: Boolean, default: false },
    // imageUrl: { type: String, required: false }, // If implemented later
  },
  { timestamps: true }
);

// Ensure location is not created if both latitude and longitude are null/undefined
ReportSchema.pre('save', function (next) {
  if (this.location && (this.location.latitude == null || this.location.longitude == null)) {
    this.location = undefined; // or null, depending on how you want to store it
  }
  next();
});


const ReportModel: Model<IReport> = models.Report || mongoose.model<IReport>('Report', ReportSchema);

export default ReportModel;
