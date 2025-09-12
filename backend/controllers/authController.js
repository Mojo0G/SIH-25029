import { AuthService } from "../services/authService.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if(!username || !password){
      return res.status(400).json({ 
        success: false, 
        message: "Username and password are required", 
        data: null 
      });
    }
    const result = await AuthService.login(username, password);
    return res.status(200).json({ 
      success: true, 
      message: "Login successful", 
      data: result 
    });
  } catch (error) {
    if (error.message === "username and password required") {
      return res.status(400).json({ 
        success: false, 
        message: error.message, 
        data: null 
      });
    }
    if (error.message === "invalid credentials") {
      return res.status(401).json({ 
        success: false, 
        message: error.message, 
        data: null 
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      data: null 
    });
  }
};
