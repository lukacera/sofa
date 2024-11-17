import { connectToDB } from "@/app/utils/connectWithDB"
import { NextResponse } from "next/server";
import { CompanyType } from "@/app/types/Company";
import Company from "@/app/schemas/Company";

const companies: CompanyType[] = [
    {
        name: "Company name",
        description: "A description",
        location: {
            city: "Belgrade"
        },
        createdAt: new Date(),
        createdEvents: [],
        email: "",
        updatedAt: new Date()
    },
    {
        name: "Cera it",
        description: "A description 243",
        location: {
            city: "Barcelona"
        },
        createdAt: new Date(),
        createdEvents: [],
        email: "",
        updatedAt: new Date()
    }
]

export const POST = async () => {
    try {
        await connectToDB();
        await Company.insertMany(companies)
        return NextResponse.json({ message: 'Connected to the database' }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Internal error in route.ts' }, { status: 500 })
    }
}