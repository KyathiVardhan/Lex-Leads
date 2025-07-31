import { Request, Response } from "express";
import AddNewLead from "../models/AddNewLead";
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
    userInfo?: {
        userId: string;
        userName: string;
        role: string;
    };
}

const updateLead = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { leadId } = req.params;
        const {
            type_of_lead,
            project_name,
            name_of_lead,
            designation_of_lead,
            company_name,
            phone_number_of_lead,
            email_of_lead,
            intrested,
            follow_up_conversation,
            status
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

        // Convert string userId to ObjectId for database query
        const userObjectId = new mongoose.Types.ObjectId(currentUserId);

        // Find the lead and check if it exists and belongs to the current user
        const existingLead = await AddNewLead.findOne({ 
            _id: leadId, 
            created_by: userObjectId 
        });

        if (!existingLead) {
            res.status(404).json({
                success: false,
                message: "Lead not found or you don't have permission to edit it"
            });
            return;
        }

        // Update the lead
        const updatedLead = await AddNewLead.findByIdAndUpdate(
            leadId,
            {
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
                updated_at: new Date()
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Lead updated successfully",
            data: updatedLead
        });
    } catch (error: any) {
        console.error("Error updating lead:", error);
        
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

        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            res.status(400).json({
                success: false,
                message: "Invalid lead ID format"
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

export default updateLead; 