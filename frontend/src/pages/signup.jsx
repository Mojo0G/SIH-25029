import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useTheme } from '../components/theme-provider';

// Skipper UI Background Component with Framer Motion 
const SkipperBackground = () => {
  const [skippers] = useState(() => {
    const items = [];
    for (let i = 0; i < 12; i++) {
      items.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 20 + 20,
        delay: Math.random() * 2,
        color: `rgba(34, 197, 94, ${Math.random() * 0.2 + 0.05})`
      });
    }
    return items;
  });

  return (
    <div className="fixed inset-0 overflow-hidden z-0">
      {skippers.map((skipper) => (
        <motion.div
          key={skipper.id}
          className="absolute rounded-full"
          style={{
            left: `${skipper.x}%`,
            top: `${skipper.y}%`,
            width: `${skipper.size}rem`,
            height: `${skipper.size}rem`,
            backgroundColor: skipper.color,
          }}
          animate={{
            y: [0, -15, 0],
            x: [0, 8, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: skipper.duration,
            repeat: Infinity,
            delay: skipper.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Main Signup Form Component with Framer Motion
const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { theme } = useTheme(); // Get the current theme
  const navigate = useNavigate(); // Initialize navigate function

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        // Redirect to login page after successful signup
        navigate('/login');
      }, 1500);
    }
  };

  // Determine card classes based on theme
  const cardClass = theme === 'light' 
    ? "rounded-2xl shadow-xl border border-gray-200 backdrop-blur-sm bg-white/90 text-gray-900" 
    : "rounded-2xl shadow-xl border border-gray-800 backdrop-blur-sm bg-gray-800/90 text-white";

  const footerClass = theme === 'light'
    ? "text-center text-gray-600 text-sm bg-white/60 backdrop-blur-sm px-4 py-3 rounded-full border border-gray-200"
    : "text-center text-gray-300 text-sm bg-gray-800/60 backdrop-blur-sm px-4 py-3 rounded-full border border-gray-700";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <SkipperBackground />
      <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 text-white relative overflow-hidden flex items-center justify-center p-4 relative z-10`}>
        <div className="max-w-md w-full space-y-8">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Card className={cardClass}>
              <CardHeader className="text-center space-y-1">
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <CardTitle className="text-3xl font-bold text-green-600">
                    Create Account
                  </CardTitle>
                </motion.div>
                <motion.div
                  initial={{ y: -5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <CardDescription className={`mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                    Sign up to get started
                  </CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.form 
                  className="space-y-4" 
                  onSubmit={handleSubmit}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="firstName" className="text-green-600">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className={theme === 'light' 
                          ? `bg-white border-gray-300 text-gray-900 ${errors.firstName ? 'border-red-500' : ''}`
                          : `bg-gray-700 border-gray-600 text-white ${errors.firstName ? 'border-red-500' : ''}`
                        }
                        placeholder="First name"
                      />
                      {errors.firstName && (
                        <motion.p 
                          className="text-sm text-red-500 mt-1"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.2 }}
                        >
                          {errors.firstName}
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="lastName" className="text-green-600">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className={theme === 'light' 
                          ? `bg-white border-gray-300 text-gray-900 ${errors.lastName ? 'border-red-500' : ''}`
                          : `bg-gray-700 border-gray-600 text-white ${errors.lastName ? 'border-red-500' : ''}`
                        }
                        placeholder="Last name"
                      />
                      {errors.lastName && (
                        <motion.p 
                          className="text-sm text-red-500 mt-1"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.2 }}
                        >
                          {errors.lastName}
                        </motion.p>
                      )}
                    </motion.div>
                  </div>

                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="email" className="text-green-600">
                      Email address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={theme === 'light' 
                        ? `bg-white border-gray-300 text-gray-900 ${errors.email ? 'border-red-500' : ''}`
                        : `bg-gray-700 border-gray-600 text-white ${errors.email ? 'border-red-500' : ''}`
                      }
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <motion.p 
                        className="text-sm text-red-500 mt-1"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.2 }}
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="password" className="text-green-600">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className={theme === 'light'
                          ? `bg-white border-gray-300 text-gray-900 ${errors.password ? 'border-red-500 pr-10' : 'pr-10'}`
                          : `bg-gray-700 border-gray-600 text-white ${errors.password ? 'border-red-500 pr-10' : 'pr-10'}`
                        }
                        placeholder="Create a password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={`absolute right-0 top-0 h-full px-3 py-2 ${theme === 'light' ? 'text-gray-500 hover:text-green-600' : 'text-gray-400 hover:text-green-400'} bg-transparent`}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <motion.p 
                        className="text-sm text-red-500 mt-1"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.2 }}
                      >
                        {errors.password}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="confirmPassword" className="text-green-600">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={theme === 'light'
                          ? `bg-white border-gray-300 text-gray-900 ${errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}`
                          : `bg-gray-700 border-gray-600 text-white ${errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}`
                        }
                        placeholder="Confirm your password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={`absolute right-0 top-0 h-full px-3 py-2 ${theme === 'light' ? 'text-gray-500 hover:text-green-600' : 'text-gray-400 hover:text-green-400'} bg-transparent`}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <motion.p 
                        className="text-sm text-red-500 mt-1"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.2 }}
                      >
                        {errors.confirmPassword}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div 
                    className="flex items-start space-x-2 pt-2"
                    variants={itemVariants}
                  >
                    <Checkbox 
                      id="agreeToTerms" 
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => {
                        setFormData(prev => ({...prev, agreeToTerms: checked}));
                      }}
                      className={theme === 'light' 
                        ? "border-gray-400 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" 
                        : "border-gray-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                      } 
                    />
                    <Label htmlFor="agreeToTerms" className={`text-sm font-normal ${theme === 'light' ? 'text-gray-700' : 'text-green-300'}`}>
                      I agree to the <Link to="/terms" className="font-medium text-green-600 hover:text-green-700">Terms and Conditions</Link> and <Link to="/privacy" className="font-medium text-green-600 hover:text-green-700">Privacy Policy</Link>
                    </Label>
                  </motion.div>
                  {errors.agreeToTerms && (
                    <motion.p 
                      className="text-sm text-red-500"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.2 }}
                    >
                      {errors.agreeToTerms}
                    </motion.p>
                  )}

                  <motion.div variants={itemVariants} className="pt-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-green-600 hover:bg-green-700 text-white h-11"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </motion.div>
                </motion.form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            className={footerClass}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-700">
              Sign in
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SignupForm;