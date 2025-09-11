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
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge
            variant="outline"
            className="border-green-500 text-green-600 dark:border-green-400 dark:text-green-400 mb-6"
          >
            About Our Team
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 text-gray-900 dark:text-white">
            Building the Future of <span className="text-green-600 dark:text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">Certificate Verification</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
            We're a passionate team of developers and innovators working to revolutionize academic certificate authentication through blockchain technology and AI-powered fraud detection. Our mission is to create a tamper-proof, instantly verifiable system that educational institutions and employers can trust.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-green-600 dark:text-green-400 mb-2">
                {stat.number}{stat.suffix}
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Mission & Vision */}
        <motion.div
          className="grid lg:grid-cols-2 gap-12 mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
            <div className="flex items-center mb-6">
              <Target className="size-8 text-green-600 dark:text-green-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              To eliminate certificate fraud and streamline the verification process by creating a secure, transparent, and instantly accessible blockchain-based authentication system that serves educational institutions, employers, and students worldwide.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
            <div className="flex items-center mb-6">
              <Award className="size-8 text-green-600 dark:text-green-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Vision</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              A world where academic achievements are universally trusted, instantly verifiable, and completely secure. We envision a future where certificate fraud is eliminated through technology, and educational credentials have the same reliability as physical documents.
            </p>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our <span className="text-green-600 dark:text-green-400">Team</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Dedicated professionals bringing together expertise in blockchain, AI, and full-stack development
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-green-600 dark:text-green-400 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our <span className="text-green-600 dark:text-green-400">Values</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The principles that guide our development and shape our approach to solving educational challenges
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="text-center group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="size-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center bg-gray-50 dark:bg-gray-800 rounded-xl p-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Join Us in <span className="text-green-600 dark:text-green-400">Revolutionizing</span> Education
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Ready to experience the future of certificate verification? Try our platform and see how blockchain and AI can transform academic authentication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-green-600 hover:bg-green-700 text-white border-green-600">
              Try Our Platform
            </Button>
            <Button
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-950/20"
            >
              Contact Us
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
