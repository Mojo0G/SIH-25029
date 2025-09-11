import {
  ArrowRight,
  ArrowUpRight,
  Upload,
  X,
  File,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { TextFade } from "./textFade";
import {HeroDescription} from "../components/heroDescription"
import {motion} from "framer-motion"

const Hero = ({
  badge = "🚀 SIH 2025 Project",
  heading = "Blockchain + AI Certificate Authentication System",
  description = "Revolutionary academic certificate verification using blockchain technology and AI-powered fraud detection. Upload certificates for instant verification, tamper-proof storage, and secure authentication in just 10 days of development.",
  buttons = {
    primary: {
      text: "Upload Certificate",
      url: "#upload",
    },
    secondary: {
      text: "View Demo",
      url: "#demo",
    },
  },
  image = {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    alt: "Hero section demo image showing interface components",
  },
}) => {
  const [files, setFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const zipFiles = droppedFiles.filter(
      (file) =>
        file.type === "application/zip" ||
        file.type === "application/x-zip-compressed" ||
        file.name.toLowerCase().endsWith(".zip")
    );

    if (zipFiles.length > 0) {
      setFiles((prev) => [...prev, ...zipFiles]);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const zipFiles = selectedFiles.filter(
      (file) =>
        file.type === "application/zip" ||
        file.type === "application/x-zip-compressed" ||
        file.name.toLowerCase().endsWith(".zip")
    );

    if (zipFiles.length > 0) {
      setFiles((prev) => [...prev, ...zipFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileType) => {
    return <File className="h-10 w-10 text-green-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <section className="min-h-screen py-12 px-4 sm:py-20 sm:px-6 lg:px-20 border-b-1">
      <div className="container mx-auto max-w-7xl">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left order-2 lg:order-1">
            {badge && (
              <Badge
                variant="outline"
                className="border-green-500 text-green-600 dark:border-green-400 dark:text-green-400"
              >
                {badge}
                <ArrowUpRight className="ml-2 size-4" />
              </Badge>
            )}
            
              <h1 className="my-4 sm:my-6 text-pretty text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                <TextFade direction={"up"} delay={0.2}>
                  <span className="text-gray-900 dark:text-white">
                  Blockchain +{" "}<span className="text-green-600 dark:text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">
                 AI
                </span>
                </span>
                </TextFade>
                <TextFade delay={0.3} direction={"up"}>
                  <span className="text-gray-900 dark:text-white">
                  {" "}
                  Certificate Authentication System
                </span>
                </TextFade>
              </h1>
            
            {/* <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
              <span>Revolutionary academic certificate verification using{" "}</span>
              <span className="text-green-600 dark:text-green-400 font-semibold">
                blockchain technology
              </span>{" "}
              and{" "}
              <span className="text-green-600 dark:text-green-400 font-semibold">
                AI-powered fraud detection
              </span>
              . Upload certificates for instant verification, tamper-proof
              storage, and secure authentication in just 10 days of development.
            </p> */}

            <HeroDescription/>
            <div className="flex w-full flex-col justify-center gap-3 sm:flex-row lg:justify-start mt-6 sm:mt-8">
              {buttons.primary && (
                <Button
                  asChild
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white border-green-600 py-3 sm:py-2 text-base sm:text-sm"
                >
                  <a href={buttons.primary.url}>{buttons.primary.text}</a>
                </Button>
              )}
              {buttons.secondary && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full sm:w-auto border-green-500 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-950/20 py-3 sm:py-2 text-base sm:text-sm"
                >
                  <a href={buttons.secondary.url}>
                    {buttons.secondary.text}
                    <ArrowRight className="size-4 ml-2" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          <motion.div 
          animate={{opacity:1, x:0}}
          initial={{opacity:0, x:100}}
          transition={{duration:1, delay:0.5}}
          className="w-full max-w-2xl mx-auto order-1 lg:order-2">
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 lg:p-12 text-center transition-all duration-300 min-h-[300px] sm:min-h-[350px] lg:min-h-[400px] flex items-center justify-center ${
                isDragOver
                  ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".zip"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="flex flex-col items-center space-y-4 sm:space-y-6">
                <div
                  className={`p-4 sm:p-6 rounded-full ${
                    isDragOver
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  <Upload
                    className={`h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 ${
                      isDragOver
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  />
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                    {isDragOver
                      ? "Drop certificates here"
                      : "Upload Academic Certificates"}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 px-2">
                    Secure blockchain verification with AI fraud detection. Only
                    ZIP files containing certificates are accepted.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-green-500 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-950/20 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base lg:text-lg"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose Certificate Files
                  </Button>
                </div>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-6 sm:mt-8 space-y-4">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Selected Certificates ({files.length})
                </h4>
                <div className="space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                            {file.name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 sm:h-9 sm:w-9 p-0 text-gray-400 hover:text-red-500 flex-shrink-0 ml-2"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                    </div>
                  ))}
                </div>

                {files.length > 0 && (
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white mt-4 sm:mt-6 py-3 text-base sm:text-lg">
                    🔐 Verify with Blockchain & AI
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export { Hero };
