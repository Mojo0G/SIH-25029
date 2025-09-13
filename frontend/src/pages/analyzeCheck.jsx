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
  const [apiError, setApiError] = useState(null);
  const [aiVerificationData, setAiVerificationData] = useState(null);

  useEffect(() => {
    // Get the selected result from location state or use the first result
    if (location.state?.selectedResult) {
      setSelectedResult(location.state.selectedResult);
      performAIVerification(location.state.selectedResult);
    } else if (results && results.length > 0) {
      setSelectedResult(results[0]);
      performAIVerification(results[0]);
    } else {
      navigate('/analyze');
    }
  }, [location.state, results, navigate]);

  const performAIVerification = async (result) => {
    setIsLoading(true);
    setApiError(null);
    try {
      // Use the complete AI verification endpoint
      const aiResult = await completeAIVerification(result.file);
      
      if (aiResult.success) {
        // Store complete AI verification data
        setAiVerificationData(aiResult);

        // Extract database validation results for legacy display
        const dbValidation = aiResult.database_validation;
        if (dbValidation && dbValidation.status === 'found') {
          const match = {
            studentName: dbValidation.matching_record.studentName,
            rollNumber: dbValidation.matching_record.rollNumber,
            institutionName: dbValidation.matching_record.institutionName,
            course: dbValidation.matching_record.course,
            cgpa: dbValidation.matching_record.cgpa,
            accuracy: dbValidation.accuracy,
            verified: dbValidation.is_verified
          };
          setDatabaseMatches([match]);
        } else {
          setDatabaseMatches([]);
        }

        // Update selected result with AI data
        setSelectedResult(prev => ({
          ...prev,
          aiData: {
            ela: aiResult.ela,
            database_validation: aiResult.database_validation,
            verification_method: aiResult.verification_method,
            verified: aiResult.verified,
            generated_images: aiResult.generated_images
          }
        }));
      }
    } catch (error) {
      console.error('AI verification failed:', error);
      setApiError(error.message);
      setDatabaseMatches([]);
      setAiVerificationData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const completeAIVerification = async (file) => {
    try {
      console.log('🔄 Starting complete AI verification...');
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('http://localhost:8000/ai/verify', {
        method: 'POST',
        body: formData
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Non-JSON response:', responseText);
        throw new Error(`Expected JSON, got ${contentType}: ${responseText}`);
      }
      
      const result = await response.json();
      console.log('✅ AI verification successful:', result);
      
      return result;
      
    } catch (error) {
      console.error('❌ AI verification failed:', error);
      throw error;
    }
  };

  const handleBack = () => {
    navigate('/analyze');
  };

  // Get image URLs from AI verification data
  const getImageUrl = (type) => {
    if (!aiVerificationData || !aiVerificationData.generated_images) {
      return null;
    }
    
    const image = aiVerificationData.generated_images.find(img => img.type === type);
    if (image) {
      return `http://localhost:8000${image.url}`;
    }
    
    // Fallback to filename-based approach
    const baseName = selectedResult?.fileName?.split('.')[0] || 'certificate';
    return `http://localhost:8000/images/${baseName}_${type}.jpg`;
  };

  // NEW: Check if we should show ELA analysis images
  const shouldShowELAImages = () => {
    // Show ELA images if:
    // 1. No database match found, OR
    // 2. Database check failed/error
    const dbValidation = aiVerificationData?.database_validation;
    return !dbValidation || 
           dbValidation.status !== 'found' || 
           dbValidation.status === 'error' ||
           databaseMatches.length === 0;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const createImageUrl = (file) => {
    return URL.createObjectURL(file);
  };

  // Enhanced Image Component with Loading and Error States
  const ImageWithFallback = ({ src, alt, type }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleImageError = (e) => {
      console.error(`❌ Failed to load ${type} image:`, src);
      setImageError(true);
      setImageLoading(false);
    };

    const handleImageLoad = () => {
      console.log(`✅ Successfully loaded ${type} image:`, src);
      setImageLoading(false);
    };

    if (!src) {
      return (
        <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">Image not available</p>
            <p className="text-xs text-gray-400 mt-1">No URL provided</p>
          </div>
        </div>
      );
    }

    if (imageError) {
      return (
        <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">{type} image failed to load</p>
            <p className="text-xs text-gray-400 mt-1">{src}</p>
            <button 
              onClick={() => window.open(src, '_blank')}
              className="text-blue-500 text-xs mt-2 underline hover:text-blue-700"
            >
              Try direct link
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="relative">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        <img
          src={src}
          alt={alt}
          className={`w-full rounded-xl shadow-lg transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      </div>
    );
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
                <div className={`p-4 rounded-lg ${aiVerificationData?.verified ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                  <div className="flex items-center space-x-2">
                    {aiVerificationData?.verified ? 
                      <CheckCircle className="h-5 w-5 text-green-500" /> : 
                      <XCircle className="h-5 w-5 text-red-500" />
                    }
                    <span className={`font-medium ${aiVerificationData?.verified ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                      {aiVerificationData?.verified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {aiVerificationData?.verification_method || 'Overall Verification'}
                  </p>
                </div>

                {/* Show ELA status only if no database match */}
                {shouldShowELAImages() && (
                  <div className={`p-4 rounded-lg ${aiVerificationData?.ela?.verdict === 'GENUINE' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className={`h-5 w-5 ${aiVerificationData?.ela?.verdict === 'GENUINE' ? 'text-green-500' : 'text-red-500'}`} />
                      <span className={`font-medium ${aiVerificationData?.ela?.verdict === 'GENUINE' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                        {aiVerificationData?.ela?.verdict || 'Unknown'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      ELA Analysis ({aiVerificationData?.ela?.risk_level || 'Unknown'} Risk)
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
                    {databaseMatches.length > 0 ? `Accuracy: ${databaseMatches[0].accuracy?.toFixed(1)}%` : 'Certificate not found in database'}
                  </p>
                </div>

                {/* Verification Note */}
                {aiVerificationData?.analysis_summary?.verification_note && (
                  <div className="col-span-full p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="flex items-start space-x-2">
                      <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <span className="font-medium text-blue-700 dark:text-blue-400">Verification Note</span>
                        <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                          {aiVerificationData.analysis_summary.verification_note}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* OCR Data */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-blue-500" />
                Extracted Text (OCR)
              </h2>
              
              {/* Display extracted fields from AI response */}
              {aiVerificationData?.extracted_fields && (
                <div className="space-y-3">
                  {Object.entries(aiVerificationData.extracted_fields).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="font-medium text-gray-600 dark:text-gray-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {value || 'Not detected'}
                      </span>
                    </div>
                  ))}
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
              
              {apiError ? (
                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                  <XSquare className="h-5 w-5" />
                  <div>
                    <span className="font-medium block">Verification failed</span>
                    <span className="text-sm">{apiError}</span>
                  </div>
                </div>
              ) : databaseMatches.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                    <CheckSquare className="h-5 w-5" />
                    <span className="font-medium">
                      Found matching record with {databaseMatches[0].accuracy?.toFixed(1)}% accuracy
                    </span>
                  </div>
                  {databaseMatches.map((match, index) => (
                    <div key={index} className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400">Name:</span>
                          <p className="text-gray-900 dark:text-white">{match.studentName || 'Not available'}</p>
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
                        {match.cgpa && (
                          <div>
                            <span className="font-medium text-gray-600 dark:text-gray-400">CGPA:</span>
                            <p className="text-gray-900 dark:text-white">{match.cgpa}</p>
                          </div>
                        )}
                        <div className="col-span-2">
                          <span className="font-medium text-gray-600 dark:text-gray-400">Verification Status:</span>
                          <p className={`font-medium ${match.verified ? 'text-green-600' : 'text-red-600'}`}>
                            {match.verified ? 'Verified in Database' : 'Not Verified'}
                          </p>
                        </div>
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

          {/* Right Column - Analysis Images (CONDITIONAL) */}
          <div className="space-y-6">
            {/* Original Certificate - ALWAYS SHOW */}
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

            {/* Database Found Message - SHOW WHEN DATABASE MATCH FOUND */}
            {databaseMatches.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Database className="h-6 w-6 mr-2 text-green-500" />
                  Verification Complete
                </h2>
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Certificate Verified Successfully
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    This certificate was found and verified in our database with {databaseMatches[0].accuracy?.toFixed(1)}% accuracy.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    No additional tampering analysis required.
                  </p>
                </div>
              </div>
            )}

            {/* ELA Analysis Images - ONLY SHOW WHEN NO DATABASE MATCH */}
            {shouldShowELAImages() && (
              <>
                {/* ELA Analysis Image */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Brain className="h-6 w-6 mr-2 text-purple-500" />
                    ELA Analysis
                  </h2>
                  <ImageWithFallback 
                    src={getImageUrl('noise')}
                    alt="ELA analysis"
                    type="ELA analysis"
                  />
                </div>

                {/* Tampering Analysis Image */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <AlertCircle className="h-6 w-6 mr-2 text-red-500" />
                    Tampering Analysis
                  </h2>
                  <ImageWithFallback 
                    src={getImageUrl('tampered')}
                    alt="Tampering analysis"
                    type="Tampering analysis"
                  />
                </div>

                {/* Debug: Generated Images Info - ONLY WHEN SHOWING ELA */}
                {aiVerificationData?.generated_images && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <ImageIcon className="h-6 w-6 mr-2 text-green-500" />
                      Generated Images ({aiVerificationData.generated_images.length})
                    </h2>
                    <div className="space-y-2">
                      {aiVerificationData.generated_images.map((image, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <span className="text-sm font-medium capitalize">{image.type}:</span>
                          <div className="text-right">
                            <span className="text-sm text-blue-600 block">{image.filename}</span>
                            <a 
                              href={`http://localhost:8000${image.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-500 underline"
                            >
                              View directly
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzeCheck;
