import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Film.css'
import { BiTimeFive } from 'react-icons/bi'

export default function Carousel_Items({
  filmsData,
  carouselIndex,
  setCarouselIndex,
  isEdgeTransition,
  carouselBtnLeft,
  carouselBtnRight,
  carouselBtnLeftArrow,
  carouselBtnRightArrow,
}) {
  /*************** CSS **************/
  const FILM_FLEX_CONTAINER = {
    display: 'flex',
    // alignItems: 'flex-start',
    position: 'relative',
    // top: '0%',
    transform: `translateX(calc(${carouselIndex} * -100%))`,
    transition: isEdgeTransition ? 'none' : 'transform 750ms ease-in-out',
  }

  /*************** STATES AND VARS **************/
  const location = useLocation()
  const titleRef = useRef(null)
  const filmThumbnails = useRef(null)
  // const posterRef = useRef(null)
  // const previewRef = useRef(null)
  const filmItemRef = useRef(null)

  /* store which album was clicked on */
  const [openModalId, setOpenModalId] = useState(null)
  /* store which thumbnail is being hovered on */
  const [hoverId, setHoverId] = useState(null)
  /* store the calculated size of thumbnail title */
  const [titleSize, setTitleSize] = useState([])
  /* keep track when to show image vs video on thumbnail */
  const [thumbnailState, setThumbnailState] = useState('image') //'image', 'video', 'transition'
  const [isHovering, setIsHovering] = useState(false)
  const [buttonHeight, setButtonHeight] = useState(null)

  /*************** HOOKS & FUNCTIONS **************/
  /* Receive data about carouselIndex and slidesOffset from Landing page, so that when user return from Landing page, they're at the part of the carousel that were being viewed (instead of scrolling from the start) */
  useEffect(() => {
    const { returnToIndex } = location.state || {}

    if (returnToIndex !== undefined && filmThumbnails.current) {
      filmThumbnails.current.style.transition = 'none'
      // console.log('Restoring carousel to index:', returnToIndex)
      // console.log('Restoring carousel to offset:', returnToOffset)
      setCarouselIndex(returnToIndex)
      // setSlidesOffset(returnToOffset)
      setTimeout(() => {
        filmThumbnails.current.style.transition = isEdgeTransition
          ? 'none'
          : 'transform 750ms ease-in-out'
      }, 100)
    } else {
      // console.log('If statement not entered')
    }
  }, [location.state])

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

  /* Use ResizeObserver to observe size of film item, and adjust size of carousel buttons accordingly.  */
  useEffect(() => {
    const target2 = filmItemRef.current
    if (!target2) return

    const resizeObserver = new ResizeObserver((entries) => {
      const filmItemElement = entries[0]
      const filmItemHeight = filmItemElement.borderBoxSize[0].blockSize
      setButtonHeight(filmItemHeight)
    })

    resizeObserver.observe(target2)
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    if (carouselBtnLeft?.current && carouselBtnRight?.current) {
      carouselBtnLeft.current.style.height = `${buttonHeight}px`
      carouselBtnRight.current.style.height = `${buttonHeight}px`
    }
  }, [buttonHeight])

  /* Adjust thumbnailState based on isHovering state */
  useEffect(() => {
    let timer1, timer2
    if (isHovering) {
      if (carouselBtnLeft?.current && carouselBtnRight?.current) {
        carouselBtnLeft.current.style.color = 'rgb(250,250,250)'
        carouselBtnRight.current.style.color = 'rgb(250,250,250)'
      }
      // count to 2 before setting video state
      timer1 = setTimeout(() => {
        setThumbnailState('transition')
      }, 2000)
      // give 200ms to transition to video
      timer2 = setTimeout(() => {
        setThumbnailState('video')
      }, 2200)
    } else {
      if (carouselBtnLeft?.current && carouselBtnRight?.current) {
        carouselBtnLeft.current.style.color = 'black'
        carouselBtnRight.current.style.color = 'black'
      }
      setThumbnailState('image')
    }

    // always clear timer at the end
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [isHovering])

  /* Pick background color for thumbnail description that matches the image dominant color */
  useEffect(() => {
    if (hoverId != null) {
      const img = document.getElementById(`poster-${hoverId}`)
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

  /* Identify which thumbnail is being hovered on, dim button background */
  function handleThumbnailInteraction(albumId, isMouseEnter) {
    let timer
    if (isMouseEnter) {
      // console.log('Mouse entered')
      setIsHovering(true)
      setHoverId(albumId)
    } else {
      // console.log('Mouse left')
      setIsHovering(false)
      setHoverId(null)
    }
  }

  return (
    <div
      ref={filmThumbnails}
      className="film-container"
      style={FILM_FLEX_CONTAINER}
    >
      {/* Clones Left */}
      {filmsData.map(
        (film) =>
          film.id === filmsData.length && (
            <div
              className="film-object cloneLeft flex h-full w-[100%] shrink-[0] items-center justify-center"
              key={film.id}
              id="film-object-0"
            >
              <div className="thumbnail-info-container relative">
                <div className="poster">
                  <img
                    id="poster-0"
                    className="h-full w-full object-contain"
                    src={`${import.meta.env.BASE_URL}${film.poster}`}
                  />
                  <div className="thumbnail-img-overlay"></div>
                </div>
                <div
                  ref={film.id === 1 ? titleRef : null}
                  className="thumbnail-title-year"
                >
                  <div
                    className="thumbnail-title"
                    style={{ fontSize: `${titleSize * 0.055}px` }}
                  >
                    {film.title}
                    <br />
                    <span
                      className="thumbnail-year mt-3 flex items-center gap-1"
                      style={{ fontSize: `${titleSize * 0.03}px` }}
                    >
                      {film.year} | {film.country} | <BiTimeFive />{' '}
                      {`${film.runtime} mins`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ),
      )}

      {/* Real slides */}
      {filmsData.map((film) => (
        <div
          className="film-object z-2 w-[100%] border-green-700"
          key={film.id}
          id={`film-object-${film.id}`}
          ref={film.id === 1 ? filmItemRef : null}
        >
          <div
            className="thumbnail-box"
            onMouseEnter={() => handleThumbnailInteraction(film.id, true)}
            onMouseLeave={() => handleThumbnailInteraction(film.id, false)}
          >
            <div className="thumbnail-info-container relative">
              <div className="poster">
                <Link
                  to={`../film/${film.url}`}
                  className="absolute left-0 z-10 h-full w-full"
                  state={{
                    currentIndex: carouselIndex,
                  }}
                />
                <div className="h-full w-full">
                  <img
                    // ref={posterRef}
                    id={`poster-${film.id}`}
                    className="relative top-0 object-contain"
                    style={{
                      filter:
                        thumbnailState === 'transition'
                          ? 'brightness(0)'
                          : 'brightness(1)',
                      transition: 'filter 200ms ease-in-out',
                    }}
                    src={`${import.meta.env.BASE_URL}${film.poster}`}
                  />

                  {thumbnailState === 'video' && hoverId === film.id && (
                    <video
                      src={film.previewThumbnail}
                      autoPlay
                      loop
                      muted
                      playsInline
                      disablePictureInPicture
                      className="relative top-[-100%] h-full object-cover transition-opacity duration-200 ease-in-out"
                      // ref={previewRef}
                      onEnded={() => {
                        setThumbnailState('image')
                      }}
                    ></video>
                  )}
                </div>

                <div className="thumbnail-img-overlay"></div>
              </div>
              <div
                ref={film.id === 1 ? titleRef : null}
                className="thumbnail-title-year"
              >
                <div
                  className="thumbnail-title"
                  style={{ fontSize: `${titleSize * 0.055}px` }}
                >
                  {film.title}
                  <br />
                  <span
                    className="thumbnail-year mt-3 flex items-center gap-1"
                    style={{ fontSize: `${titleSize * 0.03}px` }}
                  >
                    {film.year} | {film.country} | <BiTimeFive />{' '}
                    {`${film.runtime} mins`}
                  </span>
                </div>
              </div>
            </div>

            {film.id === hoverId && (
              <div
                id={`thumbnail-description-${film.id}`}
                className="thumbnail-description relative text-lg font-thin"
              >
                {`${film.synopsis.substring(0, 250)} [...]`}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Clones Right */}
      {filmsData.map(
        (film) =>
          film.id === 1 && (
            <div
              className="film-object cloneRight flex h-full w-[100%] shrink-[0] items-center justify-center"
              key={film.id}
              id={`film-object-${filmsData.length + 1}`}
            >
              <div className="thumbnail-info-container relative">
                <div className="poster">
                  <img
                    className="h-full w-full object-contain"
                    src={`${import.meta.env.BASE_URL}${film.poster}`}
                    id={`poster-${filmsData.length + 1}`}
                  />
                  <div className="thumbnail-img-overlay"></div>
                </div>
                <div
                  ref={film.id === 1 ? titleRef : null}
                  className="thumbnail-title-year"
                >
                  <div
                    className="thumbnail-title"
                    style={{ fontSize: `${titleSize * 0.055}px` }}
                  >
                    {film.title}
                    <br />
                    <span
                      className="thumbnail-year mt-3 flex items-center gap-1"
                      style={{ fontSize: `${titleSize * 0.03}px` }}
                    >
                      {film.year} | {film.country} | <BiTimeFive />{' '}
                      {`${film.runtime} mins`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ),
      )}
    </div>
  )
}
