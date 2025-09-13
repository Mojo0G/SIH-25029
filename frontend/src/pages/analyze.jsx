import React, { useState } from 'react';
import { useUpload } from '../context/UploadContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Brain, 
  Database,
  Image as ImageIcon,
  Download,
  RefreshCw,
  Eye,
  ChevronRight,
  Shield,
  AlertCircle,
  Clock,
  User,
  Calendar,
  Award,
  Building,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Analyze = () => {
  const { results, reset } = useUpload();
  const navigate = useNavigate();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleBack = () => {
    reset();
    navigate('/');
  };

  const handleNewUpload = () => {
    reset();
    navigate('/');
  };

  const getVerificationStatus = (result) => {
    if (result.verified) {
      return {
        status: 'verified',
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        text: 'Verified',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-500/30'
      };
    } else {
      return {
        status: 'failed',
        icon: <XCircle className="h-5 w-5 text-red-500" />,
        text: 'Forgery',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-500/30'
      };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const createImageUrl = (file) => {
    return URL.createObjectURL(file);
  };

  const getTamperedImageUrl = (fileName) => {
    const baseName = fileName.split('.')[0];
    return `/api/tampered-images/${baseName}_with_boxes.jpg`;
  };

  const getAnalysisImageUrl = (fileName) => {
    const baseName = fileName.split('.')[0];
    return `/api/tampered-images/${baseName}_ela_analysis.jpg`;
  };

  const handleDocumentClick = (document, index) => {
    console.log('Document clicked:', document);
    navigate('/analyze/check', { state: { selectedResult: document } });
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedDocument(null);
  };

  if (!results || results.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 mx-auto mb-6 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            No Analysis Results
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Please upload and analyze certificates first to see detailed results.
          </p>
          <Button 
            onClick={handleNewUpload} 
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Upload Certificates
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="lg"
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl px-4 py-2"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Upload
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Certificate Analysis Results
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Detailed verification and tampering analysis
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-500 px-4 py-2 text-sm font-medium">
                <Shield className="h-4 w-4 mr-2" />
                {results.length} Certificate{results.length !== 1 ? 's' : ''} Analyzed
              </Badge>
              {showDetails && (
                <Badge variant="outline" className="text-blue-600 border-blue-500 px-4 py-2 text-sm font-medium">
                  Modal Open
                </Badge>
              )}
              <Button 
                onClick={handleNewUpload} 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                New Upload
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {results.map((result, index) => {
            const verification = getVerificationStatus(result);
            return (
              <div
                key={index}
                onClick={() => handleDocumentClick(result, index)}
                className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    {/* Left side - Document info */}
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                        <ImageIcon className="h-8 w-8 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate">
                          {result.fileName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDate(result.timestamp)}
                        </p>
                      </div>
                    </div>

                    {/* Right side - Status badges and image */}
                    <div className="flex items-center space-x-4 ml-6">
                      {/* Status Badges */}
                      <div className="flex flex-col space-y-2">
                        {/* Verification Status */}
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${verification.status === 'verified' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                          {verification.icon}
                          <span className={`text-sm font-medium ${verification.status === 'verified' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                            {verification.text}
                          </span>
                        </div>

                        {/* ✅ CONDITIONAL: Tampering Status - Only show when NOT verified */}
                        {!result.verified && (
                          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${result.aiData?.ela?.verdict === 'GENUINE' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                            <AlertCircle className={`h-4 w-4 ${result.aiData?.ela?.verdict === 'GENUINE' ? 'text-green-500' : 'text-red-500'}`} />
                            <span className={`text-sm font-medium ${result.aiData?.ela?.verdict === 'GENUINE' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                              {result.aiData?.ela?.verdict === 'GENUINE' ? 'GENUINE' : 'Seems to be tampered'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Document thumbnail */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                        <img
                          src={createImageUrl(result.file)}
                          alt={result.fileName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Click indicator */}
                      <div className="flex items-center space-x-2 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                        <span className="text-sm">View Details</span>
                        <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Document Details Modal */}
      {showDetails && selectedDocument && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeDetails}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <ImageIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedDocument.fileName}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Detailed Analysis Results
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeDetails}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Original Image */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <ImageIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Original Document
                  </h3>
                  <img
                    src={createImageUrl(selectedDocument.file)}
                    alt={selectedDocument.fileName}
                    className="w-full rounded-xl shadow-lg"
                  />
                </div>

                {/* ✅ CONDITIONAL: Tampered Image - Only show when NOT verified */}
                {!selectedDocument.verified && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                      Tampering Analysis
                    </h3>
                    <div className="relative">
                      <img
                        src={getTamperedImageUrl(selectedDocument.fileName)}
                        alt="Tampering analysis"
                        className="w-full rounded-xl shadow-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-xl items-center justify-center">
                        <div className="text-center">
                          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500 dark:text-gray-400">Tampering analysis image not available</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ✅ NEW: Verification Success Message - Only show when verified */}
                {selectedDocument.verified && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      Verification Status
                    </h3>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-500/30 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                      <h4 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-2">
                        Certificate Verified
                      </h4>
                      <p className="text-green-600 dark:text-green-300">
                        This certificate has been successfully verified and is authentic.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Analysis Details */}
              <div className="mt-8 space-y-6">
                {/* OCR Data */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                    Extracted Information
                  </h3>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Name:</span>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {selectedDocument.ocrData?.fields?.name || 'Not detected'}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Institution:</span>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {selectedDocument.ocrData?.fields?.institution || 'Not detected'}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Degree:</span>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {selectedDocument.ocrData?.fields?.degree || 'Not detected'}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Date:</span>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {selectedDocument.ocrData?.fields?.date || 'Not detected'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Full Text:</span>
                      <p className="text-sm text-gray-900 dark:text-white mt-1 max-h-32 overflow-y-auto">
                        {selectedDocument.ocrData?.text || 'No text extracted'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-purple-500" />
                    AI Verification Results
                  </h3>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Verification:</span>
                        <p className={`text-sm font-medium ${selectedDocument.verified ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedDocument.verified ? 'Verified' : 'Failed'}
                        </p>
                      </div>
                      
                      {/* ✅ CONDITIONAL: Only show ELA details when NOT verified */}
                      {!selectedDocument.verified && (
                        <>
                          <div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">ELA Analysis:</span>
                            <p className={`text-sm font-medium ${selectedDocument.aiData?.ela?.verdict === 'GENUINE' ? 'text-green-600' : 'text-red-600'}`}>
                              {selectedDocument.aiData?.ela?.verdict || 'Unknown'}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tampering Score:</span>
                            <p className="text-sm text-gray-900 dark:text-white">
                              {selectedDocument.aiData?.ela?.score ? selectedDocument.aiData.ela.score.toFixed(2) : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Risk Level:</span>
                            <p className={`text-sm font-medium ${selectedDocument.aiData?.ela?.risk_level === 'NOT TAMPERED' ? 'text-green-600' : 'text-red-600'}`}>
                              {selectedDocument.aiData?.ela?.risk_level || 'Unknown'}
                            </p>
                          </div>
                        </>
                      )}
                      
                      <div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Logo Detection:</span>
                        <p className={`text-sm font-medium ${selectedDocument.aiData?.logo?.has_logo ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedDocument.aiData?.logo?.has_logo ? 'Logo Found' : 'No Logo'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Database Validation */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Database className="h-5 w-5 mr-2 text-green-500" />
                    Database Validation
                  </h3>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Graduation Records</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedDocument.databaseValidation?.graduation ? 
                            `${selectedDocument.databaseValidation.graduation.length} records found` : 
                            'No graduation records available'
                          }
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Identity Records</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedDocument.databaseValidation?.identity ? 
                            `${selectedDocument.databaseValidation.identity.length} records found` : 
                            'No identity records available'
                          }
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Internship Records</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedDocument.databaseValidation?.internship ? 
                            `${selectedDocument.databaseValidation.internship.length} records found` : 
                            'No internship records available'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analyze;
