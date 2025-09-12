import { GraduationService } from "../services/graduationService.js";

export const getAll = async (req, res) => {
  try {
    const data = await GraduationService.getAll();
    return res.status(200).json({ 
      success: true, 
      message: "Graduation records retrieved successfully", 
      data: data 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch graduation data", 
      data: null 
    });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await GraduationService.getById(id);
    return res.status(200).json({ 
      success: true, 
      message: "Graduation record retrieved successfully", 
      data: data 
    });
  } catch (error) {
    if (error.message === "Not found") {
      return res.status(404).json({ 
        success: false, 
        message: "Graduation record not found", 
        data: null 
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch record", 
      data: null 
    });
  }
};

export const create = async (req, res) => {
  try {
    const created = await GraduationService.create(req.body);
    return res.status(201).json({ 
      success: true, 
      message: "Graduation record created successfully", 
      data: created 
    });
  } catch (error) {
    return res.status(400).json({ 
      success: false, 
      message: "Failed to create record", 
      data: { details: error.message }
    });
  }
};

export const updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await GraduationService.updateById(id, req.body);
    return res.status(200).json({ 
      success: true, 
      message: "Graduation record updated successfully", 
      data: updated 
    });
  } catch (error) {
    if (error.message === "Not found") {
      return res.status(404).json({ 
        success: false, 
        message: "Graduation record not found", 
        data: null 
      });
    }
    return res.status(400).json({ 
      success: false, 
      message: "Update failed", 
      data: null 
    });
  }
};

export const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await GraduationService.deleteById(id);
    return res.status(200).json({ 
      success: true, 
      message: "Graduation record deleted successfully", 
      data: result 
    });
  } catch (error) {
    if (error.message === "Not found") {
      return res.status(404).json({ 
        success: false, 
        message: "Graduation record not found", 
        data: null 
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: "Delete failed", 
      data: null 
    });
  }
};
