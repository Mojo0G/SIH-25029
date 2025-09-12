import { IdentityService } from "../services/identityService.js";

export const getAll = async (req, res) => {
  try {
    const data = await IdentityService.getAll();
    return res.status(200).json({ 
      success: true, 
      message: "Identity records retrieved successfully", 
      data: data 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch identities", 
      data: null 
    });
  }
};
