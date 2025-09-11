import {
  Shield,
  Brain,
  FileCheck,
  Lock,
  Zap,
  Database,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    <div className="min-h-screen flex items-center justify-center py-12 border-b-1">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="border-green-500 text-green-600 dark:border-green-400 dark:text-green-400 mb-6"
          >
            🚀 Key Features
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-gray-900 dark:text-white">
            Powerful Features for <span className="text-green-600 dark:text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">Secure Authentication</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Our cutting-edge platform combines blockchain immutability with AI intelligence to provide unparalleled certificate verification
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-8 px-6 hover:shadow-2xl hover:shadow-green-500/15 hover:border-green-400 dark:hover:border-green-500 transition-all duration-300 hover:-translate-y-2 hover:bg-green-50 dark:hover:bg-green-950/20 relative group overflow-hidden"
            >
              <div className="mb-6 h-14 w-14 flex items-center justify-center bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-105">
                <feature.icon className="size-7 text-white" />
              </div>
              <span className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-all duration-300">{feature.title}</span>
              <p className="text-gray-600 dark:text-gray-400 text-[15px] leading-relaxed transition-colors duration-300">
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
