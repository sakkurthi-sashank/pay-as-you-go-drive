import { useState } from 'react'
import { Modal, ActionIcon, Text, Stack, useMantineTheme, Button } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Dropzone } from '@mantine/dropzone'
import { IconCloudUpload } from '@tabler/icons-react'
import { s3 } from '@/pages'



export const VideoUpload = () => {
  const theme = useMantineTheme()
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  
  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a file to upload.')
      return
    }

    setUploading(true)

    const fileName = selectedFile.name
    const s3Params = {
      Bucket: "video-paas-video-not-converted",
      Key: fileName,
      Body: selectedFile,
    }

    // Upload video to S3 bucket
    s3.upload(s3Params, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
      if (err) {
        console.error('Error uploading file:', err)
        setUploading(false)
      } else {
        console.log('File uploaded successfully:', data.Location)
        setUploading(false)
        close() // Close the modal after upload complete
      }
    })
  }

  return (
    <div>
      <ActionIcon color="gray" variant="light" size={'md'}>
        <IconCloudUpload onClick={open} stroke={1.5} size={'1.2rem'} />
      </ActionIcon>
      <Modal opened={opened} onClose={close} title="Upload Video">
        <Stack>
          <Dropzone
            onDrop={(files) => {
              setSelectedFile(files[0])
            }}
            accept={['video/mp4']}
          >
            <Dropzone.Idle>
              <Stack align="center">
                <IconCloudUpload onClick={open} stroke={1.5} size={'2rem'} color={theme.colors.gray[5]} />
                <Text color={theme.colors.gray[7]}>Drop video here or click to select</Text>
              </Stack>
            </Dropzone.Idle>
          </Dropzone>
          <Button size="xs" onClick={handleUpload} loading={uploading}>
            Upload
          </Button>
        </Stack>
      </Modal>
    </div>
  )
}
