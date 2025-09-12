import React, { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'

function UploadZone({ onFilesChange }) {
  const [files, setFiles] = useState([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const updateFiles = (next) => {
    setFiles(next)
    onFilesChange && onFilesChange(next)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    const zipFiles = droppedFiles.filter(
      (file) => file.type === 'application/zip' || file.type === 'application/x-zip-compressed' || file.name.toLowerCase().endsWith('.zip')
    )
    if (zipFiles.length > 0) {
      updateFiles([...files, ...zipFiles])
    }
  }

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files || [])
    const zipFiles = selected.filter(
      (file) => file.type === 'application/zip' || file.type === 'application/x-zip-compressed' || file.name.toLowerCase().endsWith('.zip')
    )
    if (zipFiles.length > 0) {
      updateFiles([...files, ...zipFiles])
    }
  }

  const removeFile = (idx) => {
    const next = files.filter((_, i) => i !== idx)
    updateFiles(next)
  }

  return (
    <div>
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all duration-300 min-h-[240px] flex items-center justify-center ${
          isDragOver ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500'
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

        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full ${isDragOver ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
            <Upload className={`h-8 w-8 ${isDragOver ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              {isDragOver ? 'Drop certificates here' : 'Upload Academic Certificates'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Only ZIP files containing certificates are accepted.
            </p>
            <Button type="button" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-950/20 px-6" onClick={() => fileInputRef.current?.click()}>
              Choose Certificate Files
            </Button>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((f, idx) => (
            <div key={`${f.name}-${idx}`} className="flex items-center justify-between rounded-md border p-3 text-sm">
              <div className="truncate">
                <span className="font-medium">{f.name}</span>
              </div>
              <Button size="sm" variant="ghost" onClick={() => removeFile(idx)}>Remove</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UploadZone


