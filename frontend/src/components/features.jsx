import {
  Shield,
  Brain,
  FileCheck,
  Lock,
  Zap,
  Database,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    title: "Blockchain Security",
    description:
      "Immutable blockchain storage ensures certificates cannot be tampered with or forged, providing cryptographic proof of authenticity.",
  },
  {
    icon: Brain,
    title: "AI Fraud Detection",
    description:
      "Advanced AI algorithms analyze documents for signs of tampering, forgery, or manipulation with industry-leading accuracy.",
  },
  {
    icon: FileCheck,
    title: "OCR Technology",
    description:
      "Optical Character Recognition automatically extracts and validates certificate data from PDFs, images, and scanned documents.",
  },
  {
    icon: Zap,
    title: "Instant Verification",
    description:
      "Get verification results in seconds, not days. Our system processes certificates instantly upon upload with real-time results.",
  },
  {
    icon: Database,
    title: "Institution Portal",
    description:
      "Educational institutions can easily register and bulk upload certificates to the blockchain network for seamless management.",
  },
  {
    icon: Lock,
    title: "Privacy & Security",
    description:
      "End-to-end encryption and privacy-first approach ensures your sensitive certificate data remains secure and confidential.",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
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

const headerVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const Features01Page = () => {
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center py-12 border-b-1"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          variants={headerVariants}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Badge
              variant="outline"
              className="border-green-500 text-green-600 dark:border-green-400 dark:text-green-400 mb-6"
            >
              🚀 Key Features
            </Badge>
          </motion.div>
          <motion.h2
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Powerful Features for{" "}
            <motion.span
              className="text-green-600 dark:text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              Secure Authentication
            </motion.span>
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Our cutting-edge platform combines blockchain immutability with AI intelligence to provide unparalleled certificate verification
          </motion.p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                y: -10,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-8 px-6 hover:shadow-2xl hover:shadow-green-500/15 hover:border-green-400 dark:hover:border-green-500 transition-all duration-300 hover:-translate-y-2 hover:bg-green-50 dark:hover:bg-green-950/20 relative group overflow-hidden"
            >
              <motion.div
                className="mb-6 h-14 w-14 flex items-center justify-center bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-105"
                whileHover={{
                  rotate: 360,
                  scale: 1.1,
                  transition: { duration: 0.6 },
                }}
                initial={{ rotate: 0 }}
              >
                <feature.icon className="size-7 text-white" />
              </motion.div>
              <motion.span
                className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-all duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                {feature.title}
              </motion.span>
              <motion.p
                className="text-gray-600 dark:text-gray-400 text-[15px] leading-relaxed transition-colors duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                {feature.description}
              </motion.p>

              {/* Animated background gradient on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                initial={false}
                whileHover={{ opacity: 1 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Features01Page;
