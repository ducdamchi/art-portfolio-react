import { useState, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { SectionTitle, Toggle, SkeletonImage } from '@ducdam/shared'
import { RiListOrdered2, RiShuffleFill } from 'react-icons/ri'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function GridGallery({ config, allAlbums }) {
  const [sortMode, setSortMode] = useState('chronological')
  const [shuffleKey, setShuffleKey] = useState(0)
  const navigate = useNavigate()

  const chronological = useMemo(() => {
    const flat = []
    allAlbums.forEach((album) => {
      album.imgList.forEach((img) => {
        flat.push({ img, album })
      })
    })
    return flat
  }, [allAlbums])

  const flatImages = useMemo(() => {
    if (sortMode === 'chronological') return chronological
    return shuffle(chronological)
  }, [sortMode, chronological, shuffleKey])

  function handleImageClick(album, imgIndex) {
    navigate({
      to: '/$celebURL',
      params: { celebURL: album.url },
      search: { from: imgIndex },
    })
  }

  return (
    <div className="flex flex-1 flex-col pt-24 md:pt-28">
      <SectionTitle className="bg-none">{config.title}</SectionTitle>
      <div className="flex justify-center py-8 ">
        <Toggle
          options={[
            {
              value: 'chronological',
              label: (
                <span className="flex items-center gap-1.5">
                  <RiListOrdered2 className="text-lg" />
                  By Album
                </span>
              ),
            },
            {
              value: 'random',
              label: (
                <span className="flex items-center gap-1.5">
                  <RiShuffleFill className="text-lg" />
                  Shuffled
                </span>
              ),
            },
          ]}
          value={sortMode}
          onChange={(val) => {
            if (val === 'random' && sortMode === 'random') {
              setShuffleKey((k) => k + 1)
            }
            setSortMode(val)
          }}
        />
      </div>

      <div className="@container flex justify-center px-10 pb-6">
        <div className="grid w-full max-w-[2400px] grid-cols-2 gap-3 p-4 @[768px]:grid-cols-3 @[1280px]:grid-cols-4"
          style={{ gridAutoFlow: 'dense' }}
        >
          {flatImages.map(({ img, album }) => {
            const isVertical = img.orientation === 'vertical'
            return (
              <div
                key={`${sortMode}-${img.id}`}
                className={`relative cursor-pointer overflow-hidden drop-shadow-none transition-all duration-250 ease-out hover:z-10 hover:scale-[1.06] hover:drop-shadow-2xl hover:ring-15 hover:ring-white @[1280px]:hover:ring-20 ${isVertical ? 'row-span-2 h-0 min-h-full' : 'aspect-3/2'}`}
                onClick={() => handleImageClick(album, img.index)}
              >
                <SkeletonImage
                  className="h-full w-full object-cover"
                  src={`${import.meta.env.BASE_URL}${img.src}`}
                  alt={img.description}
                  loading="lazy"
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
