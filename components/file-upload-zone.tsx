"use client"

import { useState, useCallback } from "react"
import { Cloud, FileCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadZoneProps {
  onFileSelect?: (file: File | null) => void
}

export function FileUploadZone({ onFileSelect }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && isValidFileType(file)) {
      setSelectedFile(file)
      onFileSelect?.(file)
    }
  }, [onFileSelect])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && isValidFileType(file)) {
      setSelectedFile(file)
      onFileSelect?.(file)
    }
  }, [onFileSelect])

  const isValidFileType = (file: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    return validTypes.includes(file.type)
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
        isDragging
          ? "border-teal bg-teal/5"
          : selectedFile
          ? "border-emerald bg-emerald/5"
          : "border-border hover:border-muted-foreground"
      )}
    >
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex flex-col items-center gap-3">
        {selectedFile ? (
          <>
            <FileCheck className="h-10 w-10 text-emerald" />
            <div>
              <p className="text-foreground font-medium">{selectedFile.name}</p>
              <p className="text-muted-foreground text-sm mt-1">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </>
        ) : (
          <>
            <Cloud className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="text-foreground font-medium">
                Arrastra o hace clic para subir
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Maximo 10MB - PDF, JPG, PNG
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
