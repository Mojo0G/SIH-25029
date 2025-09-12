import React, { useMemo, useState } from 'react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import UploadZone from '@/components/uploadZone'
import { Mail, Shield, User as UserIcon, Flag, Upload } from 'lucide-react'

function AdminDashboardPage() {
  const [uploadedFiles, setUploadedFiles] = useState([])

  const [user] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  })

  const [flags] = useState([
    { id: 'c001', holder: 'Rahul Verma', fileName: 'graduation_rahul.pdf', status: 'invalid', reason: 'Hash mismatch on-chain' },
    { id: 'c004', holder: 'Isha Gupta', fileName: 'internship_isha.pdf', status: 'invalid', reason: 'Issuer not found' },
  ])

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

export default AdminDashboardPage


