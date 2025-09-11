import {
  Shield,
  Brain,
  FileCheck,
  Lock,
  Zap,
  Database,
} from "lucide-react";
import {motion} from "framer-motion";
import React from "react";

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

const Features01Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-gradient-to-br from-green-900 via-emerald-900 to-black dark:from-black dark:via-gray-900 dark:to-green-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-green-400 to-emerald-400 dark:from-gray-100 dark:via-green-300 dark:to-emerald-300 bg-clip-text text-transparent">
            Powerful Features for <span className="text-green-400 dark:text-green-300">Secure Authentication</span>
          </h2>
          <p className="text-xl text-gray-300 dark:text-gray-100 max-w-3xl mx-auto leading-relaxed">
            Our cutting-edge platform combines blockchain immutability with AI intelligence to provide unparalleled certificate verification
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col bg-gray-800/60 dark:bg-gray-900/80 backdrop-blur-md border border-green-500/20 dark:border-green-400/30 rounded-xl py-8 px-6 hover:shadow-2xl hover:shadow-green-500/20 hover:border-green-400/50 dark:hover:border-green-300/60 transition-all duration-300 hover:-translate-y-2 hover:bg-gray-700/70 dark:hover:bg-gray-800/90"
            >
              <div className="mb-6 h-14 w-14 flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-400 dark:to-emerald-500 rounded-xl shadow-xl shadow-green-500/30 dark:shadow-green-400/40">
                <feature.icon className="size-7 text-white" />
              </div>
              <span className="text-xl font-bold mb-3 bg-gradient-to-r from-green-400 to-emerald-400 dark:from-green-300 dark:to-emerald-300 bg-clip-text text-transparent">{feature.title}</span>
              <p className="text-gray-400 dark:text-gray-200 text-[15px] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features01Page;
