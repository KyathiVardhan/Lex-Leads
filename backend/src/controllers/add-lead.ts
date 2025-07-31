import { Request, Response } from "express";
import AddNewLead from "../models/AddNewLead";

interface AuthenticatedRequest extends Request {
    userInfo?: {
        userId: string;
        userName: string;
        role: string;
    };
}

const addLeadsToSales = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const {
            type_of_lead,
            project_name,
            name_of_lead,
            designation_of_lead,
            company_name,
            phone_number_of_lead,
            email_of_lead,
            intrested = 'COLD', // Default value
            follow_up_conversation = '', // Default value
            status = 'Open' // Default value
        } = req.body;

        // Get the current user's ID from the authenticated request
        const currentUserId = req.userInfo?.userId;
        
        if (!currentUserId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
            return;
        }

        // Validate required fields
        if (!type_of_lead || !project_name || !name_of_lead || !designation_of_lead || !company_name || !phone_number_of_lead || !email_of_lead) {
            res.status(400).json({
                success: false,
                message: "All required fields must be provided"
            });
            return;
        }

        const newLead = new AddNewLead({
            type_of_lead,
            project_name,
            name_of_lead,
            designation_of_lead,
            company_name,
            phone_number_of_lead,
            email_of_lead,
            intrested,
            follow_up_conversation,
            status,
            created_by: currentUserId
        });

        await newLead.save();

        res.status(201).json({
            success: true,
            message: "Lead added successfully",
            data: {
                type_of_lead,
                project_name,
                name_of_lead,
                designation_of_lead,
                company_name,
                phone_number_of_lead,
                email_of_lead,
                intrested,
                follow_up_conversation,
                status,
                created_by: currentUserId
            }
        });
    } catch (error: any) {
        console.error("Error adding lead:", error);
        
        // Handle specific mongoose validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((err: any) => err.message);
            res.status(400).json({
                success: false,
                message: "Validation error",
                errors: validationErrors
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

export default addLeadsToSales;