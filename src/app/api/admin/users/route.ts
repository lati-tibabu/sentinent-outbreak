import { NextResponse, type NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import UserModel from "@/models/User";
import type { UserRole } from "@/lib/types";
import { z } from "zod";

const CreateUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
  role: z.enum(["hew", "officer"]),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const validation = CreateUserSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid user data",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { username, password, role } = validation.data;

    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 409 }
      ); // 409 Conflict
    }

    // Password will be hashed by the pre-save hook in the UserModel
    const newUser = new UserModel({
      username,
      password, // Pass plain password, model will hash it
      role,
    });

    await newUser.save();

    // Do not return the password in the response
    const userResponse = {
      id: newUser._id.toString(),
      username: newUser.username,
      role: newUser.role,
    };

    return NextResponse.json(
      { message: "User created successfully", user: userResponse },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create user API error:", error);
    console.error("Error details:", JSON.stringify(error, null, 2)); // Add this line
    // Handle specific Mongoose validation errors if needed
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { message: "Validation failed", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
