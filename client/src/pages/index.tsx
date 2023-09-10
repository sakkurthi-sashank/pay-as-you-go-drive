import { useEffect, useState } from 'react'
import { Box, Card, Image, Flex, Header, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import AWS from 'aws-sdk'
import { VideoUpload } from '@/components/VideoUpload'
import { awsConfig } from '../config/awsConfig'
import { MediaPlayer, MediaOutlet, MediaCommunitySkin } from '@vidstack/react'

import 'vidstack/styles/defaults.css'
import 'vidstack/styles/community-skin/video.css'

const s3 = new AWS.S3({
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.secretAccessKey,
  region: awsConfig.region,
})

export default function Home() {
  const [allVideos, setAllVideos] = useState<AWS.S3.ObjectList | undefined>(undefined)

  useEffect(() => {
    listVideos()
  }, [])

  const listVideos = () => {
    s3.listObjects({ Bucket: 'video-paas-video-converted' }, (err, data) => {
      if (err) {
        console.error(err)
      } else {
        setAllVideos(data.Contents)
      }
    })
  }

  return (
    <Box
      sx={{
        height: '100vh',
      }}
    >
      <Header
        height={50}
        px={'lg'}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'end',
        }}
      >
        <VideoUpload />
      </Header>
      <Flex gap={'lg'} p={'lg'} wrap={'wrap'}>
        {allVideos?.map((video) => (
          <Box key={video.Key} w={'100%'} maw={350}>
            <VideoPlayer VideoKey={video.Key!} />
          </Box>
        ))}
      </Flex>
    </Box>
  )
}

const VideoPlayer = ({ VideoKey }: { VideoKey: string }) => {
  const [url, setUrl] = useState<string>('')
  const [opened, { open, close }] = useDisclosure(false)

  useEffect(() => {
    const url = `https://video-paas-video-converted.s3.ap-south-2.amazonaws.com/${VideoKey}`
    setUrl(url)
  }, [VideoKey])

  return (
    <>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        w={'100%'}
        maw={350}
        onClick={open}
        sx={{
          cursor: 'pointer',
        }}
      >
        <Card.Section>
          <Image width={'100%'} bg={'white'} height={200} src={null} alt="With default placeholder" withPlaceholder />
        </Card.Section>
      </Card>
      <Modal opened={opened} onClose={close} size={'xl'} title="View Video">
        <Box>
          <MediaPlayer title="Sprite Fight" src={url} aspectRatio={16 / 9} crossorigin="">
            <MediaOutlet></MediaOutlet>
            <MediaCommunitySkin />
          </MediaPlayer>
        </Box>
      </Modal>
    </>
  )
}
