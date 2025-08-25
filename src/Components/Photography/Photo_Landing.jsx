import { useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import '../../App.css'
import './Photography.css'
import Modal from './Photo_Modal'
import albumsData from './albums.json'

import {
  BiLogoGmail,
  BiLogoInstagramAlt,
  BiFolderOpen,
  BiLeftArrowAlt,
  BiTimeFive,
  BiRightArrowAlt,
  BiLogoGithub,
  BiCopyright,
  BiArrowBack,
  BiChevronLeft,
  BiChevronRight,
} from 'react-icons/bi'

export default function Landing() {
  const [openModalId, setOpenModalId] = useState(null)
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const [screenHeight, setScreenHeight] = useState(window.innerHeight)
  const [isMobileMode, setIsMobileMode] = useState(false)
  const [modalOpened, setModalOpened] = useState(false)
  const [boxHeight, setBoxHeight] = useState(0)
  const landingRef = useRef(null)
  const imgRef = useRef(null)
  const infoBoxRef = useRef(null)
  const headerRef = useRef(null)

  const { photoURL } = useParams()

  const matchedAlbum = albumsData.find((album) => album.url === photoURL)

  const measureBoxHeight = () => {
    if (infoBoxRef.current) {
      const rect = infoBoxRef.current.getBoundingClientRect()
      setBoxHeight(rect.height) //get height in pixels
      console.log(`Info box height: ${rect.height}`)
    }
  }

  /* Dynamically obtain window size and height of infoBox*/
  useEffect(() => {
    measureBoxHeight()
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
      setScreenHeight(window.innerHeight)
      measureBoxHeight()
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  /* Flag mobile mode if screenwidth smaller than 768px */
  useEffect(() => {
    screenWidth < 768 || screenHeight < 768
      ? setIsMobileMode(true)
      : setIsMobileMode(false)
    // console.log(`Mobile mode: ${isMobileMode}`)
  }, [screenWidth])

  /* Pick color for info-box header from dominant color of background */
  useEffect(() => {
    if (!matchedAlbum || isMobileMode || modalOpened) return

    const img = imgRef.current
    const infoBox = infoBoxRef.current
    const header = headerRef.current
    const colorThief = new ColorThief()

    const applyColor = () => {
      try {
        const color = colorThief.getColor(img) // sync
        /* Check brightness of dominant color to ensure readability 
      Formula: https://www.nbdtech.com/Blog/archive/2008/04/27/Calculating-the-Perceived-Brightness-of-a-Color.aspx */
        const brightness = Math.round(
          Math.sqrt(
            color[0] * color[0] * 0.241 +
              color[1] * color[1] * 0.691 +
              color[2] * color[2] * 0.068,
          ),
        )
        // const rgb = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
        /* If bg dark enough, font can be white */
        if (brightness < 130) {
          infoBox.style.borderColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.85)`
          header.style.backgroundColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.85)`
          /* If bg a little light, reduce each rgb value by 33% */
        } else if (130 <= brightness < 194) {
          infoBox.style.borderColor = `rgba(${color[0] * 0.66}, ${color[1] * 0.66}, ${color[2] * 0.66}, 0.85)`
          header.style.backgroundColor = `rgba(${color[0] * 0.66}, ${color[1] * 0.66}, ${color[2] * 0.66}, 0.85)`
          /* If bg too light, reduce each rgb value by 66% */
        } else {
          infoBox.style.borderColor = `rgba(${color[0] * 0.33}, ${color[1] * 0.33}, ${color[2] * 0.33}, 0.85)`
          header.style.backgroundColor = `rgba(${color[0] * 0.33}, ${color[1] * 0.33}, ${color[2] * 0.33}, 0.85)`
        }
        // if (infoBox) infoBox.style.borderColor = rgb
        // if (header) header.style.backgroundColor = rgb
      } catch (err) {
        console.warn('ColorThief error:', err)
      }
    }

    if (img && img.complete && img.naturalHeight !== 0) {
      // Cached image already loaded
      applyColor()
    } else if (img) {
      // Wait for image to load
      img.addEventListener('load', applyColor)
      return () => img.removeEventListener('load', applyColor)
    }
  }, [matchedAlbum?.id, isMobileMode, modalOpened])

  /* Dynamically adjust the height of the landing page based on the height of the info box 
  boxHeight: height of infoBox
  screenHeight: height of screen
  landingHeight: height of landing page*/
  useEffect(() => {
    // If not in mobile mode
    if (
      !isMobileMode &&
      landingRef.current &&
      infoBoxRef.current &&
      boxHeight
    ) {
      const h = boxHeight * 1.333
      // Calculate desired distance from top of infoBox so that it is always centered on page.
      // If box height is smaller than screen height
      if (boxHeight < screenHeight) {
        // calculate size of boxHeight compared to screenHeight
        const s = 100 - (boxHeight / screenHeight) * 100
        console.log(s)

        // if boxHeight is >75% of screenHeight, use boxHeight * 1.3 as the value for landingHeight.
        if (s < 25) {
          landingRef.current.style.height = `${h}px`
          infoBoxRef.current.style.top = `12.5%`
          console.log(`case 1`)
          // if not, use screenHeight as the value for landingHeight. then center infoBox
        } else {
          landingRef.current.style.height = `${screenHeight}px`
          infoBoxRef.current.style.top = `${s / 2}%`
          console.log(`case 2`)
        }

        // If boxHeight is bigger than screenHeight
      } else {
        landingRef.current.style.height = `${h}px`
        infoBoxRef.current.style.top = `12.5%`
        console.log(`case 3`)
      }

      // Mobile mode
    } else {
      landingRef.current.style.height = `100vh`
      // infoBoxRef.current.style.top = `12.5%`
    }
  }, [boxHeight, screenHeight, screenWidth, modalOpened, isMobileMode])

  if (!matchedAlbum) {
    return <div>Page not found</div>
  }

  return (
    <div>
      <div>
        <div
          className="photo-landing-whole relative top-0 left-0"
          ref={landingRef}
        >
          <img
            ref={imgRef}
            className="photo-landing-background"
            src={`${import.meta.env.BASE_URL}${matchedAlbum.thumbnail.src}`}
            id={`photo-landing-bg-${matchedAlbum.id}`}
            alt=""
          />
          <div className="photo-landing-overlay"></div>

          {/* MOBILE MODE */}
          {isMobileMode && !modalOpened && (
            <>
              <div className="photo-landing-backArrow-wrapper-2 flex justify-center">
                <div className="photo-landing-backArrow-wrapper-1 flex p-6">
                  <div className="photo-landing-backArrow z-10">
                    <Link
                      to={`/photography`}
                      className="flex items-center gap-1 text-base"
                    >
                      <BiLeftArrowAlt className="text-xl" />
                      BACK
                    </Link>
                  </div>
                </div>
              </div>

              <div className="photo-landing-viewButton-wrapper flex justify-center">
                <div
                  className="photo-landing-viewButton md:5xl text-4xl"
                  onClick={() => {
                    setOpenModalId(matchedAlbum.id)
                    setModalOpened(true)
                  }}
                >
                  <BiFolderOpen />
                </div>
              </div>

              <div>
                <div className="photo-landing-mobile-title-year flex flex-col p-6">
                  <div className="photo-landing-mobile-title">
                    {matchedAlbum.title}
                  </div>
                  <div className="photo-landing-mobile-year">
                    {matchedAlbum.year}
                  </div>
                  <div className="photo-landing-mobile-time mb-8 flex items-center gap-1">
                    <BiTimeFive />
                    {`${matchedAlbum.viewTime} mins`}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* DESKTOP MODE */}
          {!isMobileMode && !modalOpened && (
            <>
              <div className="photo-landing-info-wrapper flex justify-center">
                <div
                  className="photo-landing-info-all flex flex-col border-0"
                  id={`photo-landing-info-all-${matchedAlbum.id}`}
                  ref={infoBoxRef}
                >
                  <div
                    className="photo-landing-header p-3 pl-6"
                    ref={headerRef}
                  >
                    <div className="photo-landing-button-back z-2 flex w-[15%] items-center justify-start text-white">
                      <Link
                        to={`/photography`}
                        // onClick={() => console.log('clicked on link')}
                        className="z-10 flex items-center justify-center"
                      >
                        <BiLeftArrowAlt className="text-xl" />
                        <div className="text-base">BACK</div>
                      </Link>
                    </div>
                  </div>
                  <div className="photo-landing-info flex flex-col p-6">
                    <div className="photo-landing-info-title">
                      {matchedAlbum.title}
                    </div>
                    <div className="photo-landing-info-year">
                      {matchedAlbum.year}
                    </div>
                    <div className="photo-landing-info-time mb-8 flex items-center gap-1">
                      <BiTimeFive />
                      {`${matchedAlbum.viewTime} mins`}
                    </div>

                    <div className="photo-landing-info-description mb-20">
                      {matchedAlbum.description.map((paragraph, index) => (
                        <p key={index} className="mb-2">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="photo-landing-buttons absolute bottom-0 mb-5 flex w-full justify-center p-6">
                    <div
                      className="photo-landing-button-view z-10 flex items-center justify-center gap-1 border-1 p-2"
                      onClick={() => {
                        setOpenModalId(matchedAlbum.id)
                        setModalOpened(true)
                      }}
                    >
                      <BiFolderOpen className="text-xl" />
                      <div className="text-base">VIEW</div>
                      {/* <BiRightArrowAlt className="text-xl" /> */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="photo-landing-footer absolute bottom-0 z-100 flex w-[100%] items-center justify-between p-3">
                <div className="">
                  <div className="flex items-center gap-1 text-[0.6rem] font-thin">
                    <span className="footer-text text-white">
                      ALL IMAGES &#169; DUC DAM 2025
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 text-center text-white">
                  <div className="flex items-center text-2xl">
                    <a
                      href={`mailto:ducdamchi@gmail.com?
                          &subject=Just visited your website`}
                    >
                      <BiLogoGmail />
                    </a>
                  </div>
                  <div className="text-2xl">
                    <a
                      href="https://www.instagram.com/ducdamchi"
                      target="_blank"
                    >
                      <BiLogoInstagramAlt />
                    </a>
                  </div>
                  {/* <div className="text-2xl">
                        <a href="https://github.com/ducdamchi" target="_blank">
                          <BiLogoGithub />
                        </a>
                      </div> */}
                </div>
              </div>
            </>
          )}
        </div>

        {isMobileMode && !modalOpened && (
          <div className="relative">
            <div className="photo-landing-mobileBottom relative bg-zinc-50">
              <div className="photo-landing-mobile-info flex flex-col justify-center gap-2 p-6">
                <div>
                  INTRODUCTION
                  <br />
                </div>
                <div>
                  {matchedAlbum.description.map((paragraph, index) => (
                    <p key={index} className="mb-2">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="landing-mobileFooter relative bottom-0 z-100 flex w-[100%] items-center justify-between p-3">
              <div className="">
                <div className="flex items-center gap-1 text-[0.6rem] font-thin">
                  <span className="footer-text text-black">
                    ALL IMAGES &#169; DUC DAM 2025
                  </span>
                </div>
              </div>
              <div className="flex gap-2 text-center text-black">
                <div className="flex items-center text-2xl">
                  <a
                    href={`mailto:ducdamchi@gmail.com?
                    &subject=Just visited your website`}
                  >
                    <BiLogoGmail />
                  </a>
                </div>
                <div className="text-2xl">
                  <a href="https://www.instagram.com/ducdamchi" target="_blank">
                    <BiLogoInstagramAlt />
                  </a>
                </div>
                {/* <div className='landing-footer-facebook'>Facebook</div> */}
                {/* <div className="text-2xl">
                  <a href="https://github.com/ducdamchi" target="_blank">
                    <BiLogoGithub />
                  </a>
                </div> */}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Viewer, hidden until thumbnail is clicked on, 
    then rendered on portal different from root */}
      {matchedAlbum.id === openModalId && (
        <Modal
          album={matchedAlbum}
          openModalId={openModalId}
          screenHeight={screenHeight}
          screenWidth={screenWidth}
          isMobileMode={isMobileMode}
          closeModal={() => {
            setOpenModalId(null)
            setModalOpened(false)
            // console.log('closing modal')
          }}
        />
      )}
    </div>
  )
}
