import {
  ArrowRight,
  ArrowUpRight,
  Upload,
  X,
  File,
  Image,
  Video,
  Music,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { TextFade } from "./textFade";
import {HeroDescription} from "../components/heroDescription"

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
    <section className="py-20 pl-20 pr-20">
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {badge && (
              <Badge
                variant="outline"
                className="border-green-500 text-green-600 dark:border-green-400 dark:text-green-400"
              >
                {badge}
                <ArrowUpRight className="ml-2 size-4" />
              </Badge>
            )}
            
              <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
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
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              {buttons.primary && (
                <Button
                  asChild
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white border-green-600"
                >
                  <a href={buttons.primary.url}>{buttons.primary.text}</a>
                </Button>
              )}
              {buttons.secondary && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full sm:w-auto border-green-500 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-950/20"
                >
                  <a href={buttons.secondary.url}>
                    {buttons.secondary.text}
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="w-full max-w-2xl mx-auto">
            <div
              className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 min-h-[400px] flex items-center justify-center ${
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

              <div className="flex flex-col items-center space-y-6">
                <div
                  className={`p-6 rounded-full ${
                    isDragOver
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  <Upload
                    className={`h-12 w-12 ${
                      isDragOver
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {isDragOver
                      ? "Drop certificates here"
                      : "Upload Academic Certificates"}
                  </h3>
                  <p className="text-base text-gray-600 dark:text-gray-400 mb-6">
                    Secure blockchain verification with AI fraud detection. Only
                    ZIP files containing certificates are accepted.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-green-500 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-950/20 px-8 py-3 text-lg"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose Certificate Files
                  </Button>
                </div>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-8 space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Selected Certificates ({files.length})
                </h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center space-x-4">
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-medium text-gray-900 dark:text-white truncate">
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 text-gray-400 hover:text-red-500"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                </div>

                {files.length > 0 && (
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white mt-6 py-3 text-lg">
                    🔐 Verify with Blockchain & AI
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero };
