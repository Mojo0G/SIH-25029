import React, { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSelector, useDispatch } from 'react-redux'
import { addFile, removeFile } from '../store/slices/fileSlice'

function UploadZone() {
  const dispatch = useDispatch();
  const files = useSelector((state) => state.file.files);
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)

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
    const imageFiles = droppedFiles.filter(
      (file) =>
        file.type.startsWith("image/") ||
        file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp|svg)$/)
    )
    if (imageFiles.length > 0) {
      // Only allow one image - replace existing if any
      dispatch(addFile(imageFiles[0]))
    }
  }

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files || [])
    const imageFiles = selected.filter(
      (file) =>
        file.type.startsWith("image/") ||
        file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp|svg)$/)
    )
    if (imageFiles.length > 0) {
      // Only allow one image - replace existing if any
      dispatch(addFile(imageFiles[0]))
    }
  }

  const handleRemoveFile = (idx) => {
    dispatch(removeFile(idx))
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
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full ${isDragOver ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
            <Upload className={`h-8 w-8 ${isDragOver ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              {isDragOver ? 'Drop certificate here' : 'Upload Academic Certificate'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload one certificate image (JPG, PNG, GIF, etc.) for verification.
            </p>
            <Button type="button" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-950/20 px-6" onClick={() => fileInputRef.current?.click()}>
              Choose Certificate Image
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
              <Button size="sm" variant="ghost" onClick={() => handleRemoveFile(idx)}>Remove</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UploadZone


