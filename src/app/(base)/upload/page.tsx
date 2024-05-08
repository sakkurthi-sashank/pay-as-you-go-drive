'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/utils/supabase/client'
import AWS from 'aws-sdk'
import { UploadCloudIcon, X } from 'lucide-react'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'

const s3 = new AWS.S3({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
})

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.')
      return
    }

    setUploading(true)

    const fileName = uuid()
    const s3Params = {
      Bucket: 'csms-videos',
      Key: `${fileName + file.name}`,
      Body: file,
    }

    s3.upload(s3Params, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
      if (err) {
        console.error('Error uploading file:', err)
        setUploading(false)
      } else {
        console.log('File uploaded successfully:', data.Location)
        setUploading(false)
        close()
      }
    })

    const { data, error } = await supabase
      .from('videos')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id!,
        blob_url: `https://csms-videos.s3.ap-south-1.amazonaws.com/${
          fileName + file.name
        }`,
        blob_type: file.type.split('/')[0] as 'video' | 'image' | 'pdf',
      })
      .select('*')
      .single()

    if (error) {
      console.error('Error inserting video:', error)
    } else {
      console.log('Video inserted successfully:', data)
    }

    await supabase.from('blob_cost').insert({
      cost: costEstimation(),
      blob_id: data?.id!,
    })

    setFile(null)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files && event.target.files[0]
    if (uploadedFile) {
      const newFile = new File([uploadedFile], uploadedFile.name, {
        type: uploadedFile.type,
        lastModified: uploadedFile.lastModified,
      })
      setFile(newFile)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    const inputElement = document.getElementById(
      'file-upload',
    ) as HTMLInputElement
    if (inputElement) {
      inputElement.value = ''
    }
  }

  const costEstimation = () => {
    if (!file) return 0

    const fileSizeMB = file.size / 1024 / 1024
    let cost = 0

    if (fileSizeMB <= 50) {
      cost = fileSizeMB * 0.023
    } else if (fileSizeMB <= 4500) {
      cost = fileSizeMB * 0.022
    } else {
      cost = fileSizeMB * 0.021
    }

    return cost * 80
  }

  return (
    <div className="container mx-auto space-y-8 p-4">
      <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
        Upload a Video to the Cloud
      </h2>

      <div className="mx-auto grid max-w-lg gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Upload a Video</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Drag and drop a file or click to upload.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-gray-300 p-6 dark:border-gray-700">
          <UploadCloudIcon className="h-10 w-10 text-gray-500 dark:text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400">
            Drag and drop a file or click to upload
          </p>
          <Input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="video/mp4,image/*,.pdf"
          />
          <Label
            className="inline-flex cursor-pointer items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            htmlFor="file-upload"
          >
            Upload
          </Label>
        </div>
        {file && (
          <div className="space-y-4 rounded-lg border p-4 dark:border-gray-800">
            <div className="space-y-4 rounded-lg border p-4 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <video
                    className="rounded-md"
                    height={48}
                    src={URL.createObjectURL(file)}
                    style={{
                      aspectRatio: '48/48',
                      objectFit: 'cover',
                    }}
                    width={48}
                  />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {file.size / 1024 / 1024} MB
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Cost: ₹{costEstimation().toFixed(3)}
                    </p>
                  </div>
                </div>
                <Button
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  size="icon"
                  variant="ghost"
                  onClick={handleRemoveFile}
                >
                  <X className="h-6 w-6" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
            </div>

            <Button
              className="mt-4 w-full"
              disabled={uploading}
              onClick={handleUpload}
            >
              Upload to S3
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
