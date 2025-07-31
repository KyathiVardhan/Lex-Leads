import { Request, Response } from "express";
import AddNewLead from "../models/AddNewLead";
import { Types } from "mongoose";

const getAllLeadsForAdmin = async (req: Request, res: Response) => {
  try {
    // Fetch all leads and populate the created_by field with sales person's name and email
    const leads = await AddNewLead.find()
      .sort({ created_at: -1 })
      .populate("created_by", "name email")
      .lean();

    // Type for populated created_by
    type PopulatedLead = typeof leads[number] & {
      created_by?: { _id: Types.ObjectId | string; name?: string; email?: string } | Types.ObjectId | string;
    };

    const leadsWithSalesPerson = (leads as PopulatedLead[]).map((lead) => {
      let sales_person_name = "";
      let sales_person_email = "";
      let created_by_id = lead.created_by;
      if (lead.created_by && typeof lead.created_by === "object" && "name" in lead.created_by) {
        sales_person_name = (lead.created_by as any).name || "";
        sales_person_email = (lead.created_by as any).email || "";
        created_by_id = (lead.created_by as any)._id || lead.created_by;
      }
      return {
        ...lead,
        sales_person_name,
        sales_person_email,
        created_by: created_by_id,
      };
    });

    res.status(200).json({
      success: true,
      message: "All leads fetched successfully",
      leads: leadsWithSalesPerson,
    });
  } catch (error: any) {
    console.error("Error fetching all leads for admin:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default getAllLeadsForAdmin;