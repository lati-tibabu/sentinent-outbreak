
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
    patientName: { type: String }, // Removed required: false
    patientAge: { type: Number }, // Removed required: false
    patientGender: {
      type: String,
      enum: ['male', 'female', 'other', 'not_specified', null], // Allow null if not provided
    }, // Removed required: false
    location: {
      latitude: { type: Number }, // Removed required: false
      longitude: { type: Number }, // Removed required: false
      default: null,
      // Removed required: false from the parent location object as well.
      // If location itself is optional, its presence is enough.
      // The sub-fields latitude/longitude being optional is handled by their individual definitions.
    },
    region: { type: String, index: true }, // Removed required: false
    isAnonymous: { type: Boolean, default: false },
    // imageUrl: { type: String, required: false }, // If implemented later
  },
  { timestamps: true }
);

// Ensure location is set to null if both latitude and longitude are null/undefined or if location object is present but empty
ReportSchema.pre('save', function (next) {
  if (this.location && (this.location.latitude == null || this.location.longitude == null)) {
    // If location object exists but coordinates are incomplete, nullify the whole location object.
    this.location = null;
  } else if (this.location && Object.keys(this.location).length === 0 && this.location.constructor === Object) {
    // If location is an empty object, set it to null
    this.location = null;
  }
  next();
});


const ReportModel: Model<IReport> = models.Report || mongoose.model<IReport>('Report', ReportSchema);

export default ReportModel;
