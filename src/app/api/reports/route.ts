
import { NextResponse, type NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import ReportModel from '@/models/Report';
import type { Report } from '@/lib/types';
import { z } from 'zod';

const reportSchema = z.object({
  timestamp: z.number(),
  symptoms: z.string().min(1, "Symptoms are required"),
  suspectedDisease: z.string().min(1, "Suspected disease is required"),
  patientName: z.string().optional(),
  patientAge: z.number().optional(),
  patientGender: z.enum(['male', 'female', 'other', 'not_specified']).optional(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).nullable().optional(),
  region: z.string().optional(),
  isAnonymous: z.boolean().optional().default(false),
});


export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    
    const validation = reportSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: "Invalid report data", errors: validation.error.errors }, { status: 400 });
    }
    
    const reportData = validation.data as Report;

    // Ensure location is null if not provided or incomplete
    if (reportData.location && (reportData.location.latitude == null || reportData.location.longitude == null)) {
      reportData.location = null;
    }
    
    const newReport = new ReportModel(reportData);
    await newReport.save();

    const savedReportObject = newReport.toObject();
     // Ensure _id is mapped to id
    const responseReport = { ...savedReportObject, id: savedReportObject._id.toString() };


    return NextResponse.json({ report: responseReport }, { status: 201 });
  } catch (error) {
    console.error('POST /api/reports error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const region = searchParams.get('region');
    const disease = searchParams.get('disease');
    const dateStr = searchParams.get('date');

    const query: any = {};
    if (region) query.region = region;
    if (disease) query.suspectedDisease = disease;
    if (dateStr) {
      const date = new Date(dateStr);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      query.timestamp = { $gte: startOfDay.getTime(), $lte: endOfDay.getTime() };
    }

    const reports = await ReportModel.find(query).sort({ timestamp: -1 });
    
    const reportsWithId = reports.map(report => {
      const reportObject = report.toObject();
      return { ...reportObject, id: reportObject._id.toString() };
    });

    return NextResponse.json({ reports: reportsWithId }, { status: 200 });
  } catch (error) {
    console.error('GET /api/reports error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    // This endpoint will delete ALL reports. Add confirmation/authorization in a real app.
    await ReportModel.deleteMany({});
    return NextResponse.json({ message: 'All reports deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/reports error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
