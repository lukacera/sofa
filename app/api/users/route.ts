import User from "@/app/schemas/User";
import { connectToDB } from "@/app/utils/connectWithDB";
import { NextResponse } from "next/server";
import { UserType } from "@/app/types/User";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        await connectToDB();
        
        const users = await User.find({})
            .sort({ createdAt: -1 })
            .select('-password');
        
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { message: "Error fetching users" }, 
            { status: 500 }
        );
    }
}

function validateUserData(data: Partial<UserType>) {
    const errors: Record<string, string> = {};

    if (!data.name?.trim()) {
        errors.name = "Name is required";
    } else if (data.name.length < 2) {
        errors.name = "Name must be at least 2 characters long";
    }
    
    if (!data.email?.trim()) {
        errors.email = "Email is required";
    } else if (!isValidEmail(data.email)) {
        errors.email = "Invalid email format";
    }

    if (!data.password?.trim()) {
        errors.password = "Password is required";
    } else if (data.password.length < 6) {
        errors.password = "Password must be at least 6 characters long";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
    try {
        await connectToDB();

        const body: UserType = await request.json();
        
        const { isValid, errors } = validateUserData(body);
        
        if (!isValid) {
            console.log(errors)
            console.log("Creating user...");
            return NextResponse.json(
                { message: "Validation error", errors },
                { status: 400 }
            );
        }

        console.log("Creating user:", body);
        const existingUser = await User.findOne({ email: body.email });
        if (existingUser) {
            return NextResponse.json(
                { 
                    message: "Validation error",
                    errors: { email: "User with this email already exists" }
                },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(body.password, 12);

        const newUser = await User.create({
            name: body.name,
            email: body.email?.toLowerCase(),
            image: body.image,
            type: body.type,
            password: hashedPassword,
            description: body.description || null,
            location: body.location || null
        });

        const userWithoutPassword = {
            ...newUser.toObject()
        };

        return NextResponse.json(userWithoutPassword, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { message: "Error creating user" }, 
            { status: 500 }
        );
    }
}