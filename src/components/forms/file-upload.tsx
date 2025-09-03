"use client"

import * as React from "react"
import { Upload, X, File, Image, FileText, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn, formatDate } from "@/lib/utils"

export interface UploadedFile {
  id: string
  file: File
  name: string
  size: number
  type: string
  url?: string
  status: 'uploading' | 'success' | 'error'
  progress?: number
  error?: string
}

interface FileUploadProps {
  onFilesChange: (files: UploadedFile[]) => void
  maxFiles?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
  multiple?: boolean
  disabled?: boolean
  className?: string
  uploadFunction?: (file: File) => Promise<string> // Returns URL
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return <Image className="w-6 h-6" />
  if (type.includes('pdf')) return <FileText className="w-6 h-6" />
  return <File className="w-6 h-6" />
}

export function FileUpload({
  onFilesChange,
  maxFiles = 5,
  maxSize = 10, // 10MB default
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx'],
  multiple = true,
  disabled = false,
  className,
  uploadFunction,
}: FileUploadProps) {
  const [files, setFiles] = React.useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragCounter, setDragCounter] = React.useState(0)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileValidation = (file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }
    
    if (acceptedTypes.length > 0) {
      const isAccepted = acceptedTypes.some(type => {
        if (type.includes('*')) {
          const baseType = type.split('/')[0]
          return file.type.startsWith(baseType)
        }
        return file.type === type || file.name.toLowerCase().endsWith(type)
      })
      
      if (!isAccepted) {
        return `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`
      }
    }

    return null
  }

  const processFiles = async (fileList: FileList) => {
    if (disabled) return

    const newFiles: UploadedFile[] = []
    const currentCount = files.length

    Array.from(fileList).forEach((file, index) => {
      if (currentCount + index >= maxFiles) return

      const validation = handleFileValidation(file)
      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${index}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: validation ? 'error' : 'uploading',
        progress: 0,
        error: validation || undefined,
      }

      newFiles.push(uploadedFile)
    })

    if (newFiles.length === 0) return

    const updatedFiles = [...files, ...newFiles]
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)

    // Upload files if upload function is provided
    if (uploadFunction) {
      newFiles.forEach(async (uploadedFile) => {
        if (uploadedFile.status === 'error') return

        try {
          // Simulate progress
          const progressInterval = setInterval(() => {
            setFiles(current => 
              current.map(f => 
                f.id === uploadedFile.id 
                  ? { ...f, progress: Math.min((f.progress || 0) + 10, 90) }
                  : f
              )
            )
          }, 100)

          const url = await uploadFunction(uploadedFile.file)
          
          clearInterval(progressInterval)
          
          setFiles(current => 
            current.map(f => 
              f.id === uploadedFile.id 
                ? { ...f, status: 'success', progress: 100, url }
                : f
            )
          )
        } catch (error) {
          setFiles(current => 
            current.map(f => 
              f.id === uploadedFile.id 
                ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Upload failed' }
                : f
            )
          )
        }
      })
    } else {
      // Mark as success if no upload function
      setTimeout(() => {
        setFiles(current => 
          current.map(f => 
            newFiles.find(nf => nf.id === f.id) 
              ? { ...f, status: 'success', progress: 100 }
              : f
          )
        )
      }, 1000)
    }
  }

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev + 1)
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev - 1)
    if (dragCounter === 1) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setDragCounter(0)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const canAddMore = files.length < maxFiles
  const successCount = files.filter(f => f.status === 'success').length
  const errorCount = files.filter(f => f.status === 'error').length

  return (
    <div className={cn("w-full", className)}>
      {/* Upload Area */}
      {canAddMore && (
        <Card
          className={cn(
            "relative overflow-hidden transition-all duration-200 cursor-pointer",
            isDragging ? "border-primary-400 bg-primary-50" : "border-dashed border-2 border-neutral-300",
            disabled && "opacity-50 cursor-not-allowed",
            !disabled && "hover:border-primary-400 hover:bg-neutral-50"
          )}
          onClick={!disabled ? triggerFileInput : undefined}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <CardContent className="center-flex-col py-12 px-6 text-center">
            <div className={cn(
              "w-12 h-12 rounded-lg center-flex mb-4 transition-colors",
              isDragging ? "bg-primary-200 text-primary-600" : "bg-neutral-100 text-neutral-400"
            )}>
              <Upload className="w-6 h-6" />
            </div>
            
            <h3 className="text-lg font-medium mb-2">
              {isDragging ? "Drop files here" : "Upload files"}
            </h3>
            
            <p className="text-sm text-neutral-500 mb-4">
              Drag and drop files here, or click to browse
            </p>
            
            <div className="text-xs text-neutral-400 space-y-1">
              <p>Maximum {maxFiles} files, up to {maxSize}MB each</p>
              <p>Supported formats: {acceptedTypes.join(', ')}</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple={multiple}
              accept={acceptedTypes.join(',')}
              onChange={handleFileInput}
              className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
              disabled={disabled}
            />
          </CardContent>
        </Card>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              Files ({files.length}/{maxFiles})
            </h4>
            {successCount > 0 && (
              <Badge variant="success" size="sm">
                {successCount} uploaded
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            {files.map((file) => (
              <Card key={file.id} className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="text-neutral-400">
                    {getFileIcon(file.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <Badge
                        size="sm"
                        variant={
                          file.status === 'success' ? 'success' :
                          file.status === 'error' ? 'destructive' : 'secondary'
                        }
                      >
                        {file.status}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-neutral-500">
                      {formatFileSize(file.size)}
                    </p>
                    
                    {file.error && (
                      <p className="text-xs text-error-600 mt-1">{file.error}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {file.status === 'uploading' && file.progress !== undefined && (
                      <div className="w-20">
                        <div className="w-full bg-neutral-200 rounded-full h-1.5">
                          <div
                            className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-neutral-500 mt-1 text-center">
                          {file.progress}%
                        </p>
                      </div>
                    )}
                    
                    {file.status === 'success' && (
                      <CheckCircle2 className="w-5 h-5 text-success-600" />
                    )}
                    
                    {file.status === 'error' && (
                      <AlertCircle className="w-5 h-5 text-error-600" />
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(file.id)}
                      className="text-neutral-400 hover:text-error-600 touch-target"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {canAddMore && (
            <Button
              variant="outline"
              size="touch"
              onClick={triggerFileInput}
              disabled={disabled}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Add more files
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// Compact file upload for inline usage
export function CompactFileUpload({
  onFileChange,
  acceptedTypes = ['image/*'],
  maxSize = 5,
  disabled = false,
  placeholder = "Choose file...",
}: {
  onFileChange: (file: File | null) => void
  acceptedTypes?: string[]
  maxSize?: number
  disabled?: boolean
  placeholder?: string
}) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [error, setError] = React.useState<string>()
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setError(undefined)

    if (file) {
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File size must be less than ${maxSize}MB`)
        return
      }

      if (acceptedTypes.length > 0) {
        const isAccepted = acceptedTypes.some(type => {
          if (type.includes('*')) {
            const baseType = type.split('/')[0]
            return file.type.startsWith(baseType)
          }
          return file.type === type || file.name.toLowerCase().endsWith(type)
        })

        if (!isAccepted) {
          setError(`File type not supported`)
          return
        }
      }
    }

    setSelectedFile(file)
    onFileChange(file)
  }

  const clearFile = () => {
    setSelectedFile(null)
    onFileChange(null)
    setError(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
        />
        
        <Button
          type="button"
          variant="outline"
          size="touch"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="flex-1"
        >
          {selectedFile ? selectedFile.name : placeholder}
        </Button>

        {selectedFile && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearFile}
            className="text-neutral-400 hover:text-error-600 touch-target"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}

      {selectedFile && (
        <div className="text-xs text-neutral-500">
          {formatFileSize(selectedFile.size)}
        </div>
      )}
    </div>
  )
}

export type { UploadedFile }