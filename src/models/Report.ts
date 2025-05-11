
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
    patientName: { type: String }, 
    patientAge: { type: Number }, 
    patientGender: {
      type: String,
      enum: ['male', 'female', 'other', 'not_specified', null], 
    }, 
    location: {
      type: { // Explicitly define type for the nested object
        latitude: { type: Number },
        longitude: { type: Number },
      },
      default: undefined, // Use undefined or remove default entirely if it should be absent
      required: false, // Location itself is not required
    },
    region: { type: String, index: true }, 
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
  // If location is not provided at all (i.e. undefined), it will remain undefined and not saved as null unless explicitly set
  // If this.location is already null, it will remain null.
  next();
});


const ReportModel: Model<IReport> = models.Report || mongoose.model<IReport>('Report', ReportSchema);

export default ReportModel;

