import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../../App.css'
import './Photography.css'

export default function Carousel_Items({
  albumsData,
  carouselIndex,
  setCarouselIndex,
  slidesOffset,
  setSlidesOffset,
  isEdgeTransition,
  albumsPerSlide,
  carouselBtnLeft,
  carouselBtnRight,
  screenWidth,
}) {
  /*************** STATES AND VARS **************/
  /* store which album was clicked on */
  // const [openModalId, setOpenModalId] = useState(null)
  /* store which thumbnail is being hovered on */
  const [hoverId, setHoverId] = useState(null)
  /* store clone slides */
  const [clonesLeft, setClonesLeft] = useState([])
  const [clonesRight, setClonesRight] = useState([])
  const [titleSize, setTitleSize] = useState([])
  const thumbnails = useRef(null)
  const titleRef = useRef(null)
  const location = useLocation()
  const [isHovering, setIsHovering] = useState(false)
  const [thumbnailState, setThumbnailState] = useState('image') //'image', 'video', 'transition'

  /*************** CSS **************/
  const THUMBNAIL_FLEX_CONTAINER = {
    display: 'flex',
    alignItems: 'flex-start',
    position: 'relative',
    top: '0%',
    width: 'calc(100% - 2 * var(--slider-padding))',
    transform: `translateX(calc((${carouselIndex} + ${slidesOffset}) * -100%))`,
    // transform: `translateX(-266.66%)`,
    transition: isEdgeTransition ? 'none' : 'transform 750ms ease-in-out',
    // overlow: 'visible',
  }

  const THUMBNAIL_FLEX_ITEM = {
    width: `${100 / albumsPerSlide}%`,
    // borderWidth: '3px',
    // borderStyle: 'solid',
    // borderColor: 'red'
  }

  /*************** HOOKS & FUNCTIONS **************/
  /* Identify which thumbnail is being hovered on, dim button background */
  function handleThumbnailInteraction(albumId, isMouseEnter) {
    if (isMouseEnter) {
      setHoverId(albumId)
      setIsHovering(true)

      carouselBtnLeft.current.style.opacity = '0'
      carouselBtnRight.current.style.opacity = '0'
    } else {
      setHoverId(null)
      setIsHovering(false)

      carouselBtnLeft.current.style.opacity = '1'
      carouselBtnRight.current.style.opacity = '1'
    }
  }

  /* Pick background color for thumbnail description that matches the image dominant color */
  useEffect(() => {
    if (hoverId != null) {
      const img = document.getElementById(`thumbnail-img-${hoverId}`)
      // console.log(img)
      const thumbnail_description = document.getElementById(
        `thumbnail-description-${hoverId}`,
      )
      const colorThief = new ColorThief()
      let domColor
      let brightness

      try {
        domColor = colorThief.getColor(img)
        /* Check brightness of dominant color to ensure readability 
      Formula: https://www.nbdtech.com/Blog/archive/2008/04/27/Calculating-the-Perceived-Brightness-of-a-Color.aspx */
        brightness = Math.round(
          Math.sqrt(
            domColor[0] * domColor[0] * 0.241 +
              domColor[1] * domColor[1] * 0.691 +
              domColor[2] * domColor[2] * 0.068,
          ),
        )
        /* If bg dark enough, font can be white */
        if (brightness < 130) {
          thumbnail_description.style.backgroundColor = `rgba(${domColor[0]}, ${domColor[1]}, ${domColor[2]}, 0.85)`
          /* If bg a little light, reduce each rgb value by 33% */
        } else if (130 <= brightness < 194) {
          thumbnail_description.style.backgroundColor = `rgba(${domColor[0] * 0.66}, ${domColor[1] * 0.66}, ${domColor[2] * 0.66}, 0.85)`
          /* If bg too light, reduce each rgb value by 66% */
        } else {
          thumbnail_description.style.backgroundColor = `rgba(${domColor[0] * 0.33}, ${domColor[1] * 0.33}, ${domColor[2] * 0.33}, 0.85)`
        }
      } catch (err) {
        console.log(err)
      }

      // console.log(brightness);
    }
  }, [hoverId])

  /* Adjust thumbnailState based on isHovering state */
  useEffect(() => {
    let timer1, timer2
    if (isHovering) {
      // count to 2 before setting video state
      timer1 = setTimeout(() => {
        setThumbnailState('transition')
      }, 2000)
      // give 200ms to transition to video
      timer2 = setTimeout(() => {
        setThumbnailState('video')
      }, 2000)
    } else {
      setThumbnailState('image')
    }

    // always clear timer at the end
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [isHovering])

  /* Use ResizeObserver to observe size of thumbnail, and adjust size of title accordingly.  */
  useEffect(() => {
    const target = titleRef.current
    if (!target) return

    const resizeObserver = new ResizeObserver((entries) => {
      const titleElement = entries[0]
      const titleWidth = titleElement.contentRect.width
      setTitleSize(titleWidth)
    })

    resizeObserver.observe(target)

    // console.log(`carouselIndex: ${carouselIndex}`)
    // console.log(`slidesOffset: ${slidesOffset}`)

    return () => resizeObserver.disconnect()
  }, [])

  /* Receive data about carouselIndex and slidesOffset from Landing page, so that when user return from Landing page, they're at the part of the carousel that were being viewed (instead of scrolling from the start) */
  useEffect(() => {
    const { returnToIndex, returnToOffset } = location.state || {}

    if (returnToIndex !== undefined && thumbnails.current) {
      thumbnails.current.style.transition = 'none'
      // console.log('Restoring carousel to index:', returnToIndex)
      // console.log('Restoring carousel to offset:', returnToOffset)
      setCarouselIndex(returnToIndex)
      setSlidesOffset(returnToOffset)
      setTimeout(() => {
        thumbnails.current.style.transition = isEdgeTransition
          ? 'none'
          : 'transform 750ms ease-in-out'
      }, 100)
    }
  }, [location.state])

  // const size = useSize(box)
  return (
    <div ref={thumbnails} style={THUMBNAIL_FLEX_CONTAINER}>
      {/* Clones on left side */}
      {albumsData
        .filter((album) => album.isHighlight === true)
        /* slice albumsPerSlide last items of the album list */
        .slice(-albumsPerSlide)
        .map((album) => (
          <div
            key={`cloneLeft-${album.id}`}
            className="thumbnail-flex-item"
            style={THUMBNAIL_FLEX_ITEM}
          >
            <div className="thumbnail-box">
              <div className="thumbnail-info-container-clone relative">
                <div>
                  <img
                    className="thumbnail-img-clone"
                    src={`${import.meta.env.BASE_URL}${album.thumbnail.src}`}
                  />
                  <div className="thumbnail-img-overlay"></div>
                </div>

                <div className="thumbnail-title-year">
                  <div
                    className="thumbnail-title"
                    style={{ fontSize: `${titleSize * 0.055}px` }}
                  >
                    {album.title} <br />
                    <span
                      className="thumbnail-year"
                      style={{ fontSize: `${titleSize * 0.035}px` }}
                    >
                      {album.year}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

      {/* Real slides: Iterate through each album and present its info */}
      {albumsData
        .filter((album) => album.isHighlight === true)
        .map((album) => (
          <div
            className="thumbnail-flex-item"
            key={album.id}
            style={THUMBNAIL_FLEX_ITEM}
          >
            <div
              className="thumbnail-box"
              onMouseEnter={() => handleThumbnailInteraction(album.id, true)}
              onMouseLeave={() => handleThumbnailInteraction(album.id, false)}
            >
              <div className="thumbnail-info-container relative">
                <Link
                  to={`../photography/${album.url}`}
                  state={{
                    currentIndex: carouselIndex,
                    currentOffset: slidesOffset,
                  }}
                  className="absolute top-0 left-0 z-20 h-full w-full"
                />

                <div className="relative h-full w-full">
                  <img
                    className="thumbnail-img relative top-0 object-contain"
                    id={`thumbnail-img-${album.id}`}
                    src={`${import.meta.env.BASE_URL}${album.thumbnail.src}`}
                    style={{
                      filter:
                        thumbnailState === 'transition' && hoverId === album.id
                          ? 'brightness(0)'
                          : 'brightness(1)',
                      opacity:
                        thumbnailState === 'video' && hoverId === album.id
                          ? '0'
                          : '1',
                      transition: 'filter opacity 200ms ease-in-out',
                    }}
                  />
                  {thumbnailState === 'video' && hoverId === album.id && (
                    <video
                      src={album.preview}
                      autoPlay
                      loop
                      muted
                      className="absolute top-0 z-10 h-full object-contain transition-opacity duration-200 ease-in-out"
                      // ref={previewRef}
                      onEnded={() => {
                        setThumbnailState('image')
                      }}
                    ></video>
                  )}
                  <div className="thumbnail-img-overlay relative z-10"></div>
                </div>

                <div
                  ref={album.id === 1 ? titleRef : null}
                  className="thumbnail-title-year relative z-10"
                >
                  <div
                    className="thumbnail-title"
                    style={{ fontSize: `${titleSize * 0.055}px` }}
                  >
                    {album.title} <br />
                    <span
                      className="thumbnail-year"
                      style={{ fontSize: `${titleSize * 0.045}px` }}
                    >
                      {album.year}
                    </span>
                  </div>
                </div>
              </div>

              {album.id === hoverId && (
                <div
                  id={`thumbnail-description-${album.id}`}
                  className="thumbnail-description text-lg font-thin"
                >
                  {`${album.description[0].substring(0, 250)} [...]`}
                </div>
              )}
            </div>
          </div>
        ))}

      {/* Clones on right side */}
      {albumsData
        .filter((album) => album.isHighlight === true)
        .slice(0, albumsPerSlide)
        .map((album) => (
          <div
            key={`cloneRight-${album.id}`}
            className="thumbnail-flex-item"
            style={THUMBNAIL_FLEX_ITEM}
          >
            <div className="thumbnail-box">
              <div className="thumbnail-info-container-clone relative">
                <div>
                  <img
                    className="thumbnail-img-clone"
                    src={`${import.meta.env.BASE_URL}${album.thumbnail.src}`}
                  />
                  <div className="thumbnail-img-overlay"></div>
                </div>

                <div className="thumbnail-title-year">
                  <div
                    className="thumbnail-title"
                    style={{ fontSize: `${titleSize * 0.055}px` }}
                  >
                    {album.title} <br />
                    <span
                      className="thumbnail-year"
                      style={{ fontSize: `${titleSize * 0.045}px` }}
                    >
                      {album.year}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}
