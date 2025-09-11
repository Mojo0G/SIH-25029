import {
  Users,
  Target,
  Award,
  Lightbulb,
  Heart,
  Code,
  Globe,
  Clock,
  Shield,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const teamMembers = [
  {
    name: "Sarah Chen",
    role: "Blockchain Developer",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    description: "Expert in smart contracts and distributed systems with 5+ years experience.",
  },
  {
    name: "Alex Kumar",
    role: "AI/ML Engineer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    description: "Specializes in computer vision and fraud detection algorithms.",
  },
  {
    name: "Maya Patel",
    role: "Full Stack Developer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    description: "Frontend and backend development with focus on user experience.",
  },
  {
    name: "David Johnson",
    role: "Product Manager",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    description: "Product strategy and stakeholder management in EdTech domain.",
  },
  {
    name: "Priya Sharma",
    role: "UI/UX Designer",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    description: "Creates intuitive and beautiful user interfaces with focus on accessibility.",
  },
  {
    name: "Rajesh Gupta",
    role: "DevOps Engineer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    description: "Manages cloud infrastructure and ensures system reliability and scalability.",
  },
];

const values = [
  {
    icon: Shield,
    title: "Security First",
    description: "We prioritize the highest standards of security and privacy in everything we build.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Leveraging cutting-edge technology to solve real-world educational challenges.",
  },
  {
    icon: Heart,
    title: "Trust & Transparency",
    description: "Building trust through transparent processes and reliable verification systems.",
  },
  {
    icon: Globe,
    title: "Global Impact",
    description: "Creating solutions that can scale globally and serve educational institutions worldwide.",
  },
];

const stats = [
  { number: "10", label: "Days Development", suffix: "" },
  { number: "99.9", label: "Accuracy Rate", suffix: "%" },
  { number: "6", label: "Team Members", suffix: "" },
  { number: "24/7", label: "System Uptime", suffix: "" },
];

const AboutUs = () => {
  // Animation variants with different effects
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const slideUpVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 14,
        mass: 0.8,
      },
    },
  };

  const slideLeftVariants = {
    hidden: {
      opacity: 0,
      x: -80,
      rotate: -5,
    },
    visible: {
      opacity: 1,
      x: 0,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: 0.1,
      },
    },
  };

  const slideRightVariants = {
    hidden: {
      opacity: 0,
      x: 80,
      rotate: 5,
    },
    visible: {
      opacity: 1,
      x: 0,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: 0.1,
      },
    },
  };

  const bounceVariants = {
    hidden: {
      opacity: 0,
      scale: 0.3,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.5,
      },
    },
  };

  const fadeInScaleVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <motion.div
          className="text-center mb-20"
          variants={slideUpVariants}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            whileHover={{
              rotate: 360,
              scale: 1.1,
              transition: { duration: 0.6 }
            }}
          >
            <Badge
              variant="outline"
              className="border-green-500 text-green-600 dark:border-green-400 dark:text-green-400 mb-6"
            >
              About Our Team
            </Badge>
          </motion.div>
          <motion.h1
            className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.5,
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            Building the Future of{" "}
            <motion.span
              className="text-green-600 dark:text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.9,
                duration: 0.6,
                type: "spring",
                stiffness: 150
              }}
              whileHover={{
                scale: 1.05,
                textShadow: "0 0 20px rgba(34, 197, 94, 0.8)",
                transition: { duration: 0.3 }
              }}
            >
              Certificate Verification
            </motion.span>
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.7,
              duration: 0.6,
              ease: "easeOut"
            }}
          >
            We're a passionate team of developers and innovators working to revolutionize academic certificate authentication through blockchain technology and AI-powered fraud detection. Our mission is to create a tamper-proof, instantly verifiable system that educational institutions and employers can trust.
          </motion.p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-20"
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              variants={bounceVariants}
              whileHover={{
                scale: 1.1,
                y: -5,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 10
                }
              }}
            >
              <motion.div
                className="text-4xl sm:text-5xl font-bold text-green-600 dark:text-green-400 mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.2 + index * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                }}
                whileHover={{
                  scale: 1.2,
                  color: "#22c55e",
                  transition: { duration: 0.2 }
                }}
              >
                {stat.number}{stat.suffix}
              </motion.div>
              <motion.div
                className="text-gray-600 dark:text-gray-400 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                {stat.label}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission & Vision */}
        <motion.div
          className="grid lg:grid-cols-2 gap-12 mb-20"
          variants={containerVariants}
        >
          <motion.div
            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8"
            variants={slideLeftVariants}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              rotateY: 2,
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="flex items-center mb-6"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                whileHover={{
                  rotate: 360,
                  scale: 1.2,
                  transition: { duration: 0.6 }
                }}
                whileTap={{ scale: 0.9 }}
              >
                <Target className="size-8 text-green-600 dark:text-green-400 mr-3" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
            </motion.div>
            <motion.p
              className="text-gray-600 dark:text-gray-400 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              To eliminate certificate fraud and streamline the verification process by creating a secure, transparent, and instantly accessible blockchain-based authentication system that serves educational institutions, employers, and students worldwide.
            </motion.p>
          </motion.div>

          <motion.div
            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8"
            variants={slideRightVariants}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              rotateY: -2,
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="flex items-center mb-6"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                whileHover={{
                  rotate: -360,
                  scale: 1.2,
                  transition: { duration: 0.6 }
                }}
                whileTap={{ scale: 0.9 }}
              >
                <Award className="size-8 text-green-600 dark:text-green-400 mr-3" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Vision</h2>
            </motion.div>
            <motion.p
              className="text-gray-600 dark:text-gray-400 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              A world where academic achievements are universally trusted, instantly verifiable, and completely secure. We envision a future where certificate fraud is eliminated through technology, and educational credentials have the same reliability as physical documents.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          className="mb-20"
          variants={containerVariants}
        >
          <motion.div
            className="text-center mb-12"
            variants={itemVariants}
          >
            <motion.h2
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Meet Our <motion.span
                className="text-green-600 dark:text-green-400"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                Team
              </motion.span>
            </motion.h2>
            <motion.p
              className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Dedicated professionals bringing together expertise in blockchain, AI, and full-stack development
            </motion.p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
                variants={fadeInScaleVariants}
                whileHover={{
                  scale: 1.08,
                  y: -15,
                  rotateY: index % 2 === 0 ? 5 : -5,
                  boxShadow: "0 30px 60px rgba(0,0,0,0.2)",
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    mass: 0.8
                  },
                }}
                whileTap={{
                  scale: 0.92,
                  rotate: index % 2 === 0 ? -2 : 2
                }}
                initial={{ rotateY: 0 }}
              >
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    whileHover={{
                      scale: 1.15,
                      rotate: index % 2 === 0 ? 10 : -10,
                      borderRadius: "20%"
                    }}
                    transition={{
                      duration: 0.4,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400/20 to-transparent opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
                <motion.h3
                  className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    color: "#22c55e",
                    transition: { duration: 0.2 }
                  }}
                >
                  {member.name}
                </motion.h3>
                <motion.p
                  className="text-green-600 dark:text-green-400 font-medium mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{
                    scale: 1.02,
                    textShadow: "0 0 8px rgba(34, 197, 94, 0.5)",
                  }}
                >
                  {member.role}
                </motion.p>
                <motion.p
                  className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  {member.description}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          className="mb-20"
          variants={containerVariants}
        >
          <motion.div
            className="text-center mb-12"
            variants={itemVariants}
          >
            <motion.h2
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Our <motion.span
                className="text-green-600 dark:text-green-400"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                Values
              </motion.span>
            </motion.h2>
            <motion.p
              className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              The principles that guide our development and shape our approach to solving educational challenges
            </motion.p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="text-center group"
                variants={bounceVariants}
                whileHover={{
                  scale: 1.08,
                  y: -8,
                  rotate: index % 2 === 0 ? 2 : -2,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                    mass: 0.6
                  },
                }}
                whileTap={{
                  scale: 0.9,
                  rotate: index % 2 === 0 ? -1 : 1
                }}
                initial={{ rotate: 0 }}
              >
                <motion.div
                  className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative overflow-hidden"
                  whileHover={{
                    rotate: index % 2 === 0 ? 360 : -360,
                    scale: 1.3,
                    transition: {
                      duration: 0.8,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    },
                  }}
                  initial={{ rotate: 0 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <value.icon className="size-8 text-white relative z-10" />
                </motion.div>
                <motion.h3
                  className="text-xl font-bold text-gray-900 dark:text-white mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    color: "#22c55e",
                    transition: { duration: 0.2 }
                  }}
                >
                  {value.title}
                </motion.h3>
                <motion.p
                  className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{
                    scale: 1.02,
                    color: "#16a34a",
                    transition: { duration: 0.2 }
                  }}
                >
                  {value.description}
                </motion.p>

                {/* Animated background on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-transparent rounded-xl opacity-0 -z-10"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-12 relative overflow-hidden"
          variants={fadeInScaleVariants}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 40px 80px rgba(0,0,0,0.15)",
          }}
          transition={{ duration: 0.4 }}
        >
          {/* Animated background elements */}
          <motion.div
            className="absolute top-0 left-0 w-32 h-32 bg-green-400/10 rounded-full blur-xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-lg"
            animate={{
              x: [0, -80, 0],
              y: [0, 40, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />

          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Join Us in <motion.span
              className="text-green-600 dark:text-green-400"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{
                scale: 1.1,
                textShadow: "0 0 20px rgba(34, 197, 94, 0.5)",
                transition: { duration: 0.3 }
              }}
            >
              Revolutionizing
            </motion.span> Education
          </motion.h2>
          <motion.p
            className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-2xl mx-auto relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Ready to experience the future of certificate verification? Try our platform and see how blockchain and AI can transform academic authentication.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              whileHover={{
                scale: 1.08,
                y: -3,
                boxShadow: "0 15px 30px rgba(34, 197, 94, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button className="bg-green-600 hover:bg-green-700 text-white border-green-600 px-8 py-3 text-lg font-semibold">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  Try Our Platform
                </motion.span>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{
                scale: 1.08,
                y: -3,
                boxShadow: "0 15px 30px rgba(34, 197, 94, 0.2)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-950/20 px-8 py-3 text-lg font-semibold"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  Contact Us
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Floating particles effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-green-400/30 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [-20, 20, -20],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AboutUs;
