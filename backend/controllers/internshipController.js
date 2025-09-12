import { InternshipService } from "../services/internshipService.js";

export const getAll = async (req, res) => {
  try {
    const data = await InternshipService.getAll();
    return res.status(200).json({ 
      success: true, 
      message: "Internship records retrieved successfully", 
      data: data 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch internships", 
      data: null 
    });
  }
};
