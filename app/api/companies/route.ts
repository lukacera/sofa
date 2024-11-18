import Company from "@/app/schemas/Company";
import { connectToDB } from "@/app/utils/connectWithDB";
import { NextResponse } from "next/server";
import { CompanyType } from "@/app/types/Company";

export async function GET() {
    try {
        await connectToDB();
        
        const companies = await Company.find({})
            .sort({ createdAt: -1 });
        
        return NextResponse.json(companies, { status: 200 });
    } catch (error) {
        console.error("Error fetching companies:", error);
        return NextResponse.json(
            { message: "Error fetching companies" }, 
            { status: 500 }
        );
    }
}

function validateCompanyData(data: Partial<CompanyType>) {
    const errors: Record<string, string> = {};

    if (!data.name?.trim()) {
        errors.name = "Company name is required";
    } else if (data.name.length < 2) {
        errors.name = "Company name must be at least 2 characters long";
    }

    if (!data.description?.trim()) {
        errors.description = "Description is required";
    } else if (data.description.length < 10) {
        errors.description = "Description must be at least 10 characters long";
    }

    if (!data.location?.trim()) {
        errors.location = "Location is required";
    }

    if (!data.email?.trim()) {
        errors.email = "Email is required";
    } 
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

export async function POST(request: Request) {
    try {
        await connectToDB();

        const body: Partial<CompanyType> = await request.json();
        
        const { isValid, errors } = validateCompanyData(body);
        
        if (!isValid) {
            return NextResponse.json(
                { 
                    message: "Validation error",
                    errors 
                },
                { status: 400 }
            );
        }
        const existingCompany = await Company.findOne({ email: body.email });
        if (existingCompany) {
            return NextResponse.json(
                { 
                    message: "Validation error",
                    errors: { email: "Company with this email already exists" }
                },
                { status: 400 }
            );
        }

        const newCompany: CompanyType = await Company.create({
            name: body.name,
            description: body.description,
            location: body.location,
            email: body.email,
            createdEvents: []
        });

        return NextResponse.json(newCompany, { status: 201 });
    } catch (error) {
        console.error("Error creating company:", error);
        return NextResponse.json(
            { message: "Error creating company" }, 
            { status: 500 }
        );
    }
}