import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'

const ImageAndVideoRenderer = ({
  src,
  isVideo,
}: {
  src: string
  isVideo: boolean
}) => {
  if (isVideo) {
    return <video className="h-full w-full object-cover" src={src} controls />
  }

  return (
    <div className="relative h-0 w-full" style={{ paddingBottom: '56.25%' }}>
      <Image
        className="absolute inset-0 h-full w-full object-cover"
        layout="fill"
        src={src}
        alt="Video thumbnail"
      />
    </div>
  )
}

export default async function HomePage() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id!)

  return (
    <div className="container mx-auto space-y-8 p-4">
      <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
        Popular Videos
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((video) => (
          <div key={video.id} className="overflow-hidden rounded">
            <ImageAndVideoRenderer
              src={video.blob_url}
              isVideo={video.blob_type === 'video'}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
