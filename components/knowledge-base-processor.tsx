"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Link, FileText, Globe, CheckCircle, XCircle, Clock, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProcessedFile {
  id: string
  name: string
  type: "file" | "url"
  status: "processing" | "completed" | "failed"
  progress: number
  chunks: number
  size?: number
  url?: string
  error?: string
  processedAt?: string
}

export function KnowledgeBaseProcessor() {
  const [files, setFiles] = useState<ProcessedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [urlInput, setUrlInput] = useState("")
  const { toast } = useToast()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    if (selectedFiles.length === 0) return

    setIsUploading(true)

    for (const file of selectedFiles) {
      const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9)

      // Add file to processing queue
      const newFile: ProcessedFile = {
        id: fileId,
        name: file.name,
        type: "file",
        status: "processing",
        progress: 0,
        chunks: 0,
        size: file.size,
      }

      setFiles((prev) => [...prev, newFile])

      try {
        // Upload file
        const formData = new FormData()
        formData.append("file", file)

        // Simulate progress
        const progressInterval = setInterval(() => {
          setFiles((prev) =>
            prev.map((f) => (f.id === fileId && f.progress < 90 ? { ...f, progress: f.progress + 10 } : f)),
          )
        }, 200)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        clearInterval(progressInterval)

        if (response.ok) {
          const result = await response.json()

          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? {
                    ...f,
                    status: "completed",
                    progress: 100,
                    chunks: Math.floor(Math.random() * 50) + 10, // Mock chunk count
                    processedAt: new Date().toISOString(),
                  }
                : f,
            ),
          )

          toast({
            title: "File processed successfully",
            description: `${file.name} has been added to your knowledge base.`,
          })
        } else {
          throw new Error("Upload failed")
        }
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  status: "failed",
                  error: "Failed to process file",
                }
              : f,
          ),
        )

        toast({
          title: "Upload failed",
          description: `Failed to process ${file.name}. Please try again.`,
          variant: "destructive",
        })
      }
    }

    setIsUploading(false)
  }

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return

    const urlId = Date.now().toString() + Math.random().toString(36).substr(2, 9)

    const newUrl: ProcessedFile = {
      id: urlId,
      name: urlInput,
      type: "url",
      status: "processing",
      progress: 0,
      chunks: 0,
      url: urlInput,
    }

    setFiles((prev) => [...prev, newUrl])
    setUrlInput("")

    try {
      // Simulate URL processing
      const progressInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => (f.id === urlId && f.progress < 90 ? { ...f, progress: f.progress + 15 } : f)),
        )
      }, 300)

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      clearInterval(progressInterval)

      setFiles((prev) =>
        prev.map((f) =>
          f.id === urlId
            ? {
                ...f,
                status: "completed",
                progress: 100,
                chunks: Math.floor(Math.random() * 30) + 5,
                processedAt: new Date().toISOString(),
              }
            : f,
        ),
      )

      toast({
        title: "URL processed successfully",
        description: "Content has been extracted and added to your knowledge base.",
      })
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === urlId
            ? {
                ...f,
                status: "failed",
                error: "Failed to process URL",
              }
            : f,
        ),
      )

      toast({
        title: "Processing failed",
        description: "Failed to process the URL. Please check the URL and try again.",
        variant: "destructive",
      })
    }
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
    toast({
      title: "File removed",
      description: "The file has been removed from your knowledge base.",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "processing":
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Knowledge Base Processor</h2>
        <p className="text-muted-foreground">Upload files and add URLs to build your AI's knowledge base</p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">File Upload</TabsTrigger>
          <TabsTrigger value="url">URL Processing</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload Files</span>
              </CardTitle>
              <CardDescription>Upload PDF, TXT, MD, or DOCX files to add to your knowledge base</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file-upload">Select Files</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.txt,.md,.docx"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Link className="h-5 w-5" />
                <span>Add URL</span>
              </CardTitle>
              <CardDescription>Add web pages, documentation, or articles to your knowledge base</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  placeholder="https://example.com/docs"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleUrlSubmit()}
                />
                <Button onClick={handleUrlSubmit} disabled={!urlInput.trim()}>
                  Process URL
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Processing Queue */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Queue</CardTitle>
            <CardDescription>Track the status of your knowledge base additions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    {file.type === "file" ? (
                      <FileText className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Globe className="h-5 w-5 text-green-600" />
                    )}
                    {getStatusIcon(file.status)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <div className="flex items-center space-x-2">
                        {file.status === "completed" && <Badge variant="secondary">{file.chunks} chunks</Badge>}
                        {file.size && <Badge variant="outline">{formatFileSize(file.size)}</Badge>}
                      </div>
                    </div>

                    {file.status === "processing" && (
                      <div className="space-y-1">
                        <Progress value={file.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">Processing... {file.progress}%</p>
                      </div>
                    )}

                    {file.status === "completed" && file.processedAt && (
                      <p className="text-xs text-muted-foreground">
                        Processed {new Date(file.processedAt).toLocaleString()}
                      </p>
                    )}

                    {file.status === "failed" && file.error && <p className="text-xs text-red-600">{file.error}</p>}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
