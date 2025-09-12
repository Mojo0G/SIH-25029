import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import UploadZone from '@/components/uploadZone'
import { Flag, Upload } from 'lucide-react'
import { TextFade } from '../components/textFade'

function GetResultPage() {
  const [uploadedFiles, setUploadedFiles] = useState([])

  const [flags] = useState([
    { id: 'c001', holder: 'Rahul Verma', fileName: 'graduation_rahul.pdf', status: 'invalid', reason: 'Hash mismatch on-chain' },
    { id: 'c004', holder: 'Isha Gupta', fileName: 'internship_isha.pdf', status: 'invalid', reason: 'Issuer not found' },
  ])

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="my-4 sm:my-6 text-pretty text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
            <TextFade direction={"up"} delay={0.2}>
              <span className="text-gray-900 dark:text-white">
                <span className="text-green-600 dark:text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">
                  DigiPraman
                </span>
              </span>
            </TextFade>
            <TextFade delay={0.3} direction={"up"}>
              <span className="text-gray-900 dark:text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl block mt-2">
                Result Dashboard
              </span>
            </TextFade>
          </h1>
          
          <p className="text-muted-foreground text-lg">
            View certificate verification results, upload certificate archives and review flagged entries with blockchain verification.
          </p>
        </div>


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
    </div>
  )
}

export default GetResultPage;


