import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useTheme } from '../components/theme-provider';
import { useLogin } from '../services/queries';
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

// Main Login Form Component with Framer Motion
const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { theme } = useTheme(); // Get the current theme
  const loginMutation = useLogin(); // Use TanStack Query mutation

  const validateForm = () => {
    const newErrors = {};
    
    if (!username) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Use TanStack Query mutation
      loginMutation.mutate(
        { username, password },
        {
          onSuccess: (data) => {
            localStorage.setItem('token', data.data.token);
            navigate('/');
          },
          onError: (error) => {
            setErrors({
              username: error.response.data.message,
              password: error.response.data.message
            });
          }
        }
      );
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
      <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 text-white relative overflow-hidden flex items-center justify-center p-4 z-10`}>
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
                    Welcome Back
                  </CardTitle>
                </motion.div>
                <motion.div
                  initial={{ y: -5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <CardDescription className={`mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                    Sign in to your account
                  </CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.form 
                  className="space-y-6" 
                  onSubmit={handleSubmit}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div className="space-y-4" variants={itemVariants}>
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-green-600">
                        Username
                      </Label>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={theme === 'light' 
                          ? `bg-white border-gray-300 text-gray-900 ${errors.username ? 'border-red-500' : ''}`
                          : `bg-gray-700 border-gray-600 text-white ${errors.username ? 'border-red-500' : ''}`
                        }
                        placeholder="Enter your username"
                      />
                      {errors.username && (
                        <motion.p 
                          className="text-sm text-red-500 mt-1"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.2 }}
                        >
                          {errors.username}
                        </motion.p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-green-600">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={theme === 'light'
                            ? `bg-white border-gray-300 text-gray-900 ${errors.password ? 'border-red-500 pr-10' : 'pr-10'}`
                            : `bg-gray-700 border-gray-600 text-white ${errors.password ? 'border-red-500 pr-10' : 'pr-10'}`
                          }
                          placeholder="Enter your password"
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
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-center justify-between"
                    variants={itemVariants}
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember-me" 
                        className={theme === 'light' 
                          ? "border-gray-400 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" 
                          : "border-gray-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                        } 
                      />
                      <Label htmlFor="remember-me" className={`text-sm font-normal ${theme === 'light' ? 'text-gray-700' : 'text-green-300'}`}>
                        Remember me
                      </Label>
                    </div>

                    <div className="text-sm">
                      <Link to="/forgot-password" className="font-medium text-green-600 hover:text-green-700">
                        Forgot your password?
                      </Link>
                    </div>
                  </motion.div>

                  {/* Error Message */}
                  {loginMutation.isError && (
                    <motion.div 
                      className="flex items-center space-x-2 text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.2 }}
                    >
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">
                        {loginMutation.error?.message || 'Login failed. Please try again.'}
                      </span>
                    </motion.div>
                  )}

                  <motion.div variants={itemVariants}>
                    <Button
                      type="submit"
                      disabled={loginMutation.isPending}
                      className="w-full bg-green-600 hover:bg-green-700 text-white h-11"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        'Sign in'
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
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-green-600 hover:text-green-700">
              Sign up
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;