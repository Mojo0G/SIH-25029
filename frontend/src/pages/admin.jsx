import React, { useMemo, useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import UploadZone from '@/components/uploadZone'
import { useUpload } from '../context/UploadContext'
import { Mail, Shield, User as UserIcon, Flag, Upload, Eye, CheckCircle, XCircle, AlertTriangle, FileText, Brain, Database, Clock, ChevronRight, X } from 'lucide-react'

function AdminDashboardPage() {
  const [uploadedFiles, setUploadedFiles] = useState([])
  const { results } = useUpload()
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  const [user] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  })

  const [flags] = useState([
    { id: 'c001', holder: 'Rahul Verma', fileName: 'graduation_rahul.pdf', status: 'invalid', reason: 'Hash mismatch on-chain' },
    { id: 'c004', holder: 'Isha Gupta', fileName: 'internship_isha.pdf', status: 'invalid', reason: 'Issuer not found' },
  ])

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
        text: 'Failed',
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

  const handleDocumentClick = (document) => {
    setSelectedDocument(document);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedDocument(null);
  };

  const initials = useMemo(() => user.name.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase(), [user.name])

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-3">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">Manage credentials, upload certificate archives and review flagged entries.</p>
        </div>

        {/* User Credentials */}
        <section className="mb-8 rounded-xl border border-green-200 dark:border-green-500/30 bg-card backdrop-blur-sm p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-6 flex items-center gap-2">
            <Shield className="size-6" />
            User Credentials
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="size-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
              {initials}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <UserIcon className="size-5 text-green-600 dark:text-green-400" />
                <div>
                  <div className="text-sm text-muted-foreground font-medium">Name</div>
                  <div className="text-foreground font-semibold">{user.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="size-5 text-green-600 dark:text-green-400" />
                <div className="min-w-0">
                  <div className="text-sm text-muted-foreground font-medium">Email</div>
                  <div className="text-foreground truncate">{user.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Shield className="size-5 text-green-600 dark:text-green-400" />
                <div>
                  <div className="text-sm text-muted-foreground font-medium">Role</div>
                  <div className="text-foreground font-semibold capitalize">{user.role}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* File Upload Window */}
        <section className="mb-8 rounded-xl border border-green-200 dark:border-green-500/30 bg-card backdrop-blur-sm p-6 shadow-lg">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
              <Upload className="size-6" />
              File Upload
            </h2>
          </div>
          <div className="bg-muted/30 rounded-lg p-4">
            <UploadZone onFilesChange={setUploadedFiles} />
          </div>
        </section>

        {/* Recent Uploads with Analysis */}
        {results && results.length > 0 && (
          <section className="mb-8 rounded-xl border border-green-200 dark:border-green-500/30 bg-card backdrop-blur-sm p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                <Upload className="size-6" />
                Recent Uploads & Analysis
              </h2>
              <div className="text-sm text-muted-foreground flex items-center gap-2 bg-green-100 dark:bg-green-500/10 px-3 py-1 rounded-full border border-green-300 dark:border-green-500/30">
                <CheckCircle className="size-4 text-green-600 dark:text-green-400" />
                {results.length} Analyzed
              </div>
            </div>
            <div className="space-y-4">
              {results.map((result, index) => {
                const verification = getVerificationStatus(result);
                return (
                  <div
                    key={index}
                    onClick={() => handleDocumentClick(result)}
                    className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        {/* Left side - Document info */}
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                            <FileText className="h-6 w-6 text-white" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg truncate">
                              {result.fileName}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                              <Clock className="h-4 w-4 mr-1" />
                              {formatDate(result.timestamp)}
                            </p>
                          </div>

                          {/* Document thumbnail */}
                          <div className="w-16 h-16 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                            <img
                              src={createImageUrl(result.file)}
                              alt={result.fileName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </div>

                        {/* Right side - Status and data */}
                        <div className="flex items-center space-x-6 ml-6">
                          {/* Extracted Data */}
                          <div className="flex-1 min-w-0">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                <div className="min-w-0">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Name: </span>
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {result.ocrData?.fields?.name || result.ocrData?.text?.split('\n')[0] || 'Not detected'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Brain className="h-4 w-4 text-purple-500 flex-shrink-0" />
                                <div className="min-w-0">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">AI: </span>
                                  <span className={`text-sm font-medium ${result.verified ? 'text-green-600' : 'text-red-600'}`}>
                                    {result.verified ? 'Verified' : 'Failed'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <AlertCircle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                <div className="min-w-0">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Tamper: </span>
                                  <span className={`text-sm font-medium ${result.aiData?.ela?.verdict === 'GENUINE' ? 'text-green-600' : 'text-red-600'}`}>
                                    {result.aiData?.ela?.verdict || 'Unknown'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Overall status */}
                          <div className="flex flex-col items-center space-y-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                            <Badge className={`${verification.color} px-3 py-1 text-xs font-medium`}>
                              {verification.icon}
                              <span className="ml-1">{verification.text}</span>
                            </Badge>
                          </div>

                          {/* Click indicator */}
                          <div className="flex items-center text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Analysis Results Section */}
        {results && results.length > 0 && (
          <section className="mb-8 rounded-xl border border-green-200 dark:border-green-500/30 bg-card backdrop-blur-sm p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                <Brain className="size-6" />
                Recent Analysis Results
              </h2>
              <div className="text-sm text-muted-foreground flex items-center gap-2 bg-green-100 dark:bg-green-500/10 px-3 py-1 rounded-full border border-green-300 dark:border-green-500/30">
                <CheckCircle className="size-4 text-green-600 dark:text-green-400" />
                {results.length} Analyzed
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {results.map((result, index) => {
                const verification = getVerificationStatus(result);
                return (
                  <div
                    key={index}
                    onClick={() => handleDocumentClick(result)}
                    className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                              {result.fileName}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(result.timestamp)}
                            </p>
                          </div>
                        </div>
                        <Badge className={`${verification.color} px-2 py-1 text-xs font-medium`}>
                          {verification.icon}
                          <span className="ml-1">{verification.text}</span>
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600 dark:text-gray-400">OCR</span>
                          <Badge variant="outline" className="text-blue-600 text-xs">
                            Complete
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600 dark:text-gray-400">AI Check</span>
                          <Badge 
                            variant="outline" 
                            className={result.verified ? "text-green-600 text-xs" : "text-red-600 text-xs"}
                          >
                            {result.verified ? 'Verified' : 'Failed'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Tampering</span>
                          <Badge 
                            variant="outline" 
                            className={result.aiData?.ela?.verdict === 'GENUINE' ? "text-green-600 text-xs" : "text-red-600 text-xs"}
                          >
                            {result.aiData?.ela?.verdict || 'Unknown'}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-center text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                        <span className="text-xs font-medium mr-1">Click for details</span>
                        <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Flag Section */}
        <section className="rounded-xl border border-green-200 dark:border-green-500/30 bg-card backdrop-blur-sm p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
              <Flag className="size-6" />
              Flagged Certificates
            </h2>
            <div className="text-sm text-muted-foreground flex items-center gap-2 bg-yellow-100 dark:bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-300 dark:border-yellow-500/30">
              <Flag className="size-4 text-yellow-600 dark:text-yellow-400" />
              Review Required
            </div>
          </div>
          <div className="space-y-4">
            {(uploadedFiles.length ? [] : flags).filter(f => f.status === 'invalid').map((f, idx) => (
              <div key={f.id ?? idx} className="rounded-lg border border-red-300 dark:border-red-500/40 p-4 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                <div className="flex items-center gap-4">
                  {f.imageUrl ? (
                    <img src={f.imageUrl} alt={f.fileName} className="size-14 rounded-lg object-cover border border-red-300 dark:border-red-500/30" />
                  ) : (
                    <div className="size-14 rounded-lg bg-red-200 dark:bg-red-800/50 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-medium border border-red-300 dark:border-red-500/30">
                      IMG
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-red-600 dark:text-red-400 truncate text-lg">{f.fileName}</div>
                    <div className="text-foreground truncate">{f.holder}</div>
                    <div className="text-sm text-red-700 dark:text-red-300 mt-1">{f.reason}</div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-red-200 dark:bg-red-500/20 border border-red-400 dark:border-red-500/40 text-red-700 dark:text-red-400 text-sm font-medium">
                    Invalid
                  </div>
                </div>
              </div>
            ))}
            {uploadedFiles.length === 0 && flags.filter(f=>f.status==='invalid').length === 0 && (
              <div className="text-center py-12">
                <Flag className="size-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground text-lg">No flagged certificates</p>
                <p className="text-muted-foreground text-sm">Upload certificates to see flagged items here</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Document Details Modal */}
      {showDetails && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedDocument.fileName}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Admin Analysis View
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
                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                    Original Document
                  </h3>
                  <img
                    src={createImageUrl(selectedDocument.file)}
                    alt={selectedDocument.fileName}
                    className="w-full rounded-xl shadow-lg"
                  />
                </div>

                {/* Analysis Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-purple-500" />
                    Analysis Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">Overall Status</span>
                        <Badge className={getVerificationStatus(selectedDocument).color}>
                          {getVerificationStatus(selectedDocument).icon}
                          <span className="ml-1">{getVerificationStatus(selectedDocument).text}</span>
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Analyzed on {formatDate(selectedDocument.timestamp)}
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">OCR Extraction</span>
                        <Badge variant="outline" className="text-blue-600">
                          Complete
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Text successfully extracted from document
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">AI Verification</span>
                        <Badge 
                          variant="outline" 
                          className={selectedDocument.verified ? "text-green-600" : "text-red-600"}
                        >
                          {selectedDocument.verified ? 'Verified' : 'Failed'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedDocument.verified ? 'Document passed AI verification' : 'Document failed AI verification'}
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">Tampering Check</span>
                        <Badge 
                          variant="outline" 
                          className={selectedDocument.aiData?.ela?.verdict === 'GENUINE' ? "text-green-600" : "text-red-600"}
                        >
                          {selectedDocument.aiData?.ela?.verdict || 'Unknown'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedDocument.aiData?.ela?.verdict === 'GENUINE' ? 'No tampering detected' : 'Potential tampering detected'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Analysis */}
              <div className="mt-8 space-y-6">
                {/* OCR Data */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                    Extracted Text (OCR)
                  </h3>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-h-40 overflow-y-auto">
                    <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {JSON.stringify(selectedDocument.ocrData, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-purple-500" />
                    AI Verification Results
                  </h3>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-h-40 overflow-y-auto">
                    <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {JSON.stringify(selectedDocument.aiData, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboardPage


