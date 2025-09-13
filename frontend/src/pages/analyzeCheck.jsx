import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  X,
  Search,
  CheckSquare,
  XSquare
} from 'lucide-react';

const AnalyzeCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { results } = useUpload();
  const [selectedResult, setSelectedResult] = useState(null);
  const [databaseMatches, setDatabaseMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get the selected result from location state or use the first result
    if (location.state?.selectedResult) {
      setSelectedResult(location.state.selectedResult);
      performDatabaseCheck(location.state.selectedResult);
    } else if (results && results.length > 0) {
      setSelectedResult(results[0]);
      performDatabaseCheck(results[0]);
    } else {
      navigate('/analyze');
    }
  }, [location.state, results, navigate]);

  const performDatabaseCheck = async (result) => {
    setIsLoading(true);
    try {
      // Extract name from OCR data
      const extractedName = result.ocrData?.fields?.name || 
                           result.ocrData?.text?.split('\n')[0] || 
                           'Unknown';
      
      // Check against all database collections
      const checks = await Promise.all([
        checkDatabase('graduation', extractedName),
        checkDatabase('internship', extractedName),
        checkDatabase('identity', extractedName),
        checkDatabase('jrsecondary', extractedName),
        checkDatabase('srsecondary', extractedName)
      ]);
      
      const allMatches = checks.flat().filter(match => match);
      setDatabaseMatches(allMatches);
    } catch (error) {
      console.error('Database check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkDatabase = async (collection, name) => {
    try {
      const response = await fetch(`/api/database/${collection}`);
      if (!response.ok) return [];
      
      const data = await response.json();
      return data.filter(item => 
        item.studentName?.toLowerCase().includes(name.toLowerCase()) ||
        item.name?.toLowerCase().includes(name.toLowerCase())
      );
    } catch (error) {
      console.error(`Error checking ${collection}:`, error);
      return [];
    }
  };

  const handleBack = () => {
    navigate('/analyze');
  };

  const getTamperedImageUrl = (fileName) => {
    // Extract the base name from the original filename
    const baseName = fileName.split('.')[0];
    // Try multiple possible locations for the image
    return `/api/tampered-images/${baseName}_with_boxes.jpg`;
  };

  const getAnalysisImageUrl = (fileName) => {
    // Extract the base name from the original filename
    const baseName = fileName.split('.')[0];
    // Try multiple possible locations for the image
    return `/api/tampered-images/${baseName}_ela_analysis.jpg`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const createImageUrl = (file) => {
    return URL.createObjectURL(file);
  };

  if (!selectedResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading analysis details...</p>
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
                Back to Analysis
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Certificate Analysis Check
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedResult.fileName}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Analysis Results */}
          <div className="space-y-6">
            {/* Document Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <ImageIcon className="h-6 w-6 mr-2 text-blue-500" />
                Document Overview
              </h2>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden shadow-md">
                  <img
                    src={createImageUrl(selectedResult.file)}
                    alt={selectedResult.fileName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedResult.fileName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatDate(selectedResult.timestamp)}
                  </p>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${selectedResult.verified ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                  <div className="flex items-center space-x-2">
                    {selectedResult.verified ? 
                      <CheckCircle className="h-5 w-5 text-green-500" /> : 
                      <XCircle className="h-5 w-5 text-red-500" />
                    }
                    <span className={`font-medium ${selectedResult.verified ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                      {selectedResult.verified ? 'Verified' : 'Forgery'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Overall Verification</p>
                </div>

                <div className={`p-4 rounded-lg ${selectedResult.aiData?.ela?.verdict === 'GENUINE' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className={`h-5 w-5 ${selectedResult.aiData?.ela?.verdict === 'GENUINE' ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`font-medium ${selectedResult.aiData?.ela?.verdict === 'GENUINE' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                      {selectedResult.aiData?.ela?.verdict === 'GENUINE' ? 'GENUINE' : 'Seems to be tempered'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Tampering Analysis</p>
                </div>

                {/* Tampering Accuracy Score */}
                {selectedResult.aiData?.ela?.score && (
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="flex items-center space-x-2">
                      <Brain className="h-5 w-5 text-blue-500" />
                      <span className="font-medium text-blue-700 dark:text-blue-400">
                        Tampering Score: {selectedResult.aiData.ela.score.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {selectedResult.aiData.ela.score > 50 ? 'High tampering probability' : 'Low tampering probability'}
                    </p>
                  </div>
                )}

                {/* Database Match Status */}
                <div className={`p-4 rounded-lg ${databaseMatches.length > 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                  <div className="flex items-center space-x-2">
                    <Database className={`h-5 w-5 ${databaseMatches.length > 0 ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`font-medium ${databaseMatches.length > 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                      {databaseMatches.length > 0 ? 'Database Match Found' : 'No Database Match'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {databaseMatches.length > 0 ? `${databaseMatches.length} matching record(s)` : 'Certificate not found in database'}
                  </p>
                </div>
              </div>
            </div>

            {/* OCR Data */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-blue-500" />
                Extracted Text (OCR)
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-60 overflow-y-auto">
                {selectedResult.ocrData?.text ? (
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedResult.ocrData.text.split('\n').map((line, index) => (
                      <div key={index} className="mb-1">
                        {line.trim() && (
                          <span className="block leading-relaxed">
                            {line}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    No text extracted from this document
                  </p>
                )}
              </div>
              
              {/* Structured OCR Fields */}
              {selectedResult.ocrData?.fields && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Structured Data
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(selectedResult.ocrData.fields).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-3 bg-white dark:bg-gray-600 rounded-lg">
                        <span className="font-medium text-gray-600 dark:text-gray-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {value || 'Not detected'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Database Verification */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Database className="h-6 w-6 mr-2 text-purple-500" />
                Database Verification
                {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500 ml-2"></div>}
              </h2>
              
              {databaseMatches.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                    <CheckSquare className="h-5 w-5" />
                    <span className="font-medium">Found {databaseMatches.length} matching record(s)</span>
                  </div>
                  {databaseMatches.map((match, index) => (
                    <div key={index} className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400">Name:</span>
                          <p className="text-gray-900 dark:text-white">{match.studentName || match.name}</p>
                        </div>
                        {match.rollNumber && (
                          <div>
                            <span className="font-medium text-gray-600 dark:text-gray-400">Roll Number:</span>
                            <p className="text-gray-900 dark:text-white">{match.rollNumber}</p>
                          </div>
                        )}
                        {match.institutionName && (
                          <div>
                            <span className="font-medium text-gray-600 dark:text-gray-400">Institution:</span>
                            <p className="text-gray-900 dark:text-white">{match.institutionName}</p>
                          </div>
                        )}
                        {match.course && (
                          <div>
                            <span className="font-medium text-gray-600 dark:text-gray-400">Course:</span>
                            <p className="text-gray-900 dark:text-white">{match.course}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                  <XSquare className="h-5 w-5" />
                  <span className="font-medium">No matching records found in database</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Analysis Images */}
          <div className="space-y-6">
            {/* Original Certificate */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <ImageIcon className="h-6 w-6 mr-2 text-blue-500" />
                Original Certificate
              </h2>
              <div className="relative">
                <img
                  src={createImageUrl(selectedResult.file)}
                  alt="Original certificate"
                  className="w-full rounded-xl shadow-lg"
                />
              </div>
            </div>

            {/* Tampering Analysis Image */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <AlertCircle className="h-6 w-6 mr-2 text-red-500" />
                Tampering Analysis
              </h2>
              <div className="relative">
                <img
                  src={getTamperedImageUrl(selectedResult.fileName)}
                  alt="Tampering analysis"
                  className="w-full rounded-xl shadow-lg"
                  onError={(e) => {
                    console.log('Failed to load tampered image:', getTamperedImageUrl(selectedResult.fileName));
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-xl items-center justify-center">
                  <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">Tampering analysis image not available</p>
                    <p className="text-xs text-gray-400 mt-1">Looking for: {getTamperedImageUrl(selectedResult.fileName)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ELA Analysis Image */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Brain className="h-6 w-6 mr-2 text-purple-500" />
                ELA Analysis
              </h2>
              <div className="relative">
                <img
                  src={getAnalysisImageUrl(selectedResult.fileName)}
                  alt="ELA analysis"
                  className="w-full rounded-xl shadow-lg"
                  onError={(e) => {
                    console.log('Failed to load ELA image:', getAnalysisImageUrl(selectedResult.fileName));
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-xl items-center justify-center">
                  <div className="text-center">
                    <Brain className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">ELA analysis image not available</p>
                    <p className="text-xs text-gray-400 mt-1">Looking for: {getAnalysisImageUrl(selectedResult.fileName)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzeCheck;
