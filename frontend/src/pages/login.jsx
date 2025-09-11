import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2 } from "lucide-react";

// Skipper UI Background Component with Framer Motion
const SkipperBackground = () => {
  const [skippers] = useState(() => {
    const items = [];
    for (let i = 0; i < 10; i++) {
      items.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 1,
        duration: Math.random() * 25 + 25,
        delay: Math.random() * 3,
        color: `rgba(34, 197, 94, ${Math.random() * 0.15 + 0.04})`
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
            y: [0, -12, 0],
            x: [0, 6, 0],
            scale: [1, 1.03, 1],
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
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
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        alert('Login successful!');
      }, 1500);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 8, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <SkipperBackground />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative z-10">
        <div className="max-w-md w-full space-y-8">
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Card className="rounded-2xl shadow-xl border border-gray-100 backdrop-blur-sm bg-white/90">
              <CardHeader className="text-center space-y-1">
                <motion.div
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <CardTitle className="text-3xl font-bold text-green-600 dark:text-green-400">
                    Welcome Back
                  </CardTitle>
                </motion.div>
                <motion.div
                  initial={{ y: -4, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <CardDescription className="mt-2 text-gray-600">
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
                      <Label htmlFor="email" className="text-green-600">
                        Email address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={errors.email ? 'border-red-500' : ''}
                        placeholder="Enter your email"
                      />
                      {errors.email && (
                        <motion.p 
                          className="text-sm text-red-600 mt-1"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.4 }}
                        >
                          {errors.email}
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
                          className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                          placeholder="Enter your password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-green-600"
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
                          className="text-sm text-red-600 mt-1"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.4 }}
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
                      <Checkbox id="remember-me" />
                      <Label htmlFor="remember-me" className="text-green-700 text-sm font-normal">
                        Remember me
                      </Label>
                    </div>

                    <div className="text-sm">
                      <a href="#" className="font-medium text-green-600 hover:text-green-500">
                        Forgot your password?
                      </a>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-green-600 hover:bg-green-700 text-white h-11 transition-all duration-300"
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 0.995 }}
                    >
                      {isLoading ? (
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
            className="text-center text-gray-600 text-sm bg-white/60 backdrop-blur-sm px-4 py-3 rounded-full border border-gray-200"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            Don't have an account?{' '}
            <a href="#" className="font-medium text-green-600 hover:text-green-500">
              Sign up
            </a>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;