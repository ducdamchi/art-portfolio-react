import React from 'react'
import ReactDom from 'react-dom'
import { useState, useRef, useEffect } from 'react'
import '../../App.css'
import './Film.css'
import { PiGridNineBold } from 'react-icons/pi'
import { TbSlideshow } from 'react-icons/tb'
import { TbBackground } from 'react-icons/tb'
import { ImArrowLeft } from 'react-icons/im'
import { BiArrowBack } from 'react-icons/bi'
import { CgLayoutGridSmall } from 'react-icons/cg'
import { TfiLayoutSlider } from 'react-icons/tfi'
import { PiSelectionBackgroundThin } from 'react-icons/pi'
import { BiLeftArrowAlt } from 'react-icons/bi'
import { BiChevronLeft } from 'react-icons/bi'
import { BiChevronRight } from 'react-icons/bi'

export default function Modal({
  film,
  openPressId,
  closeModal,
  screenHeight,
  screenWidth,
  isMobileMode,
}) {
  /*************** CSS **************/
  const MODAL_BG = {
    // zIndex: '20',
    // position: 'absolute',
    // top: '0%',
    // width: '100vw',
    // height: '100vh',
    // background: 'rgb(250, 250, 250)',
    transition: 'background 400ms ease-in-out',
  }

  const MODAL_REF = {
    transition: 'color 400ms ease-in-out',
  }

  const MODAL_DESC_REF = {
    transition: 'all 400ms ease-in-out',
  }

  const MODAL_CONTENT = {
    // zIndex: '130',
    // position: 'absolute',
    // textAlign: 'center',
    // width: '100%',
    // height: '70%',
    // top: '12.5%', // = (100-height)/2
    // left: '0%', // = (100-width)/2
    // color: 'white',
  }

  /*************** STATES AND VARS **************/
  const [slideIndex, setSlideIndex] = useState(0)
  const [isGalleryView, setGalleryView] = useState(false)
  const [bgColor, setBgColor] = useState('white')
  const bgRef = useRef(null)
  const modalRef = useRef(null)
  const modalContentRef = useRef(null)
  const modalDescriptionRef = useRef(null)
  const galleryRef = useRef(null)
  const slidesRef = useRef(null)
  const modal_slides_btnLeft = useRef(null)
  const modal_slides_btnRight = useRef(null)
  // const bottomPadding = document.getElementById('photo-bottomPadding')
  /*************** FUNCTIONS **************/
  function prevSlide() {
    setSlideIndex((prevIndex) => {
      let newIndex = prevIndex - 1
      if (newIndex < 0) {
        newIndex = film.pressGallery.numImages - 1
      }
      return newIndex
    })
  }

  function nextSlide() {
    setSlideIndex((prevIndex) => {
      let newIndex = prevIndex + 1
      if (newIndex > film.pressGallery.numImages - 1) {
        newIndex = 0
      }
      return newIndex
    })
  }

  function toggleView() {
    setGalleryView((galleryView) => {
      return galleryView ? false : true
    })
  }

  function toggleBackground() {
    setBgColor((prevBg) => {
      if (prevBg === 'white') {
        return 'black'
        // } else if (prevBg === 'grey') {
        //   return 'white'
      } else {
        return 'white'
      }
    })
  }

  function handleGalleryClick(imgIndex) {
    setSlideIndex(imgIndex)
    setGalleryView(false)
  }

  /*************** HOOKS **************/
  /* Handle prev/next transition in Slides View Mode */
  useEffect(() => {
    // console.log(`slide index: ${slideIndex}`)
    if (slidesRef.current) {
      const allSlides = slidesRef.current.querySelectorAll('.slides-each')
      Array.from(allSlides)

      /* Only turn on block display for slide with current index */
      for (let i = 0; i < allSlides.length; i++) {
        if (i != slideIndex) {
          allSlides[i].style.display = 'none'
          // setTimeout(() => {
          //   allSlides[i].style.display = 'none'
          // }, 300)
          // allSlides[i].classList.remove('visible')
        } else {
          allSlides[i].style.display = 'inline-block'
          // setTimeout(() => {
          //   allSlides[i].classList.add('visible')
          // }, 200)

          // console.log(allSlides[i].style)
        }
      }
    }
  }, [slideIndex])

  /* Handle transition between Gallery View and Slides View  */
  useEffect(() => {
    if (slidesRef.current && galleryRef.current) {
      if (isGalleryView) {
        /* Disable display and features for Slides View */
        slidesRef.current.style.display = 'none'
        if (modal_slides_btnLeft.current && modal_slides_btnRight.current) {
          modal_slides_btnLeft.current.style.display = 'none'
          modal_slides_btnRight.current.style.display = 'none'
        }

        /* Enable display for Gallery View */
        galleryRef.current.style.display = 'grid'
      } else {
        /* Disable display for Gallery View */
        galleryRef.current.style.display = 'none'

        /* Enable display and features for Slides View */
        slidesRef.current.style.display = 'block'
        if (modal_slides_btnLeft.current && modal_slides_btnRight.current) {
          modal_slides_btnLeft.current.style.display = 'block'
          modal_slides_btnRight.current.style.display = 'block'
        }
      }
    }
  }, [isGalleryView])

  useEffect(() => {
    if (modalContentRef.current) {
      // Mobile landscape orientation
      if (isMobileMode && screenHeight <= 640) {
        // console.log('mobile landscape')
        modalContentRef.current.style.height = '90vh'
        // Mobile portrait mode
      } else if (isMobileMode && screenHeight > 640) {
        // console.log('mobile portrait')
        modalContentRef.current.style.height = '30vh'
      } else {
        // console.log('non-mobile')
        modalContentRef.current.style.height = '75vh'
      }
    }
  }, [screenHeight, screenWidth, isMobileMode])

  /* Handle transition between background colors */
  // useEffect(() => {
  //   if (bgRef.current) {
  //     if (bgColor === 'black') {
  //       bgRef.current.style.background = 'rgb(5, 5, 5)'
  //       modalRef.current.style.color = 'rgb(255, 255, 255)'
  //       modalDescriptionRef.current.style.background = 'rgb(5, 5, 5)'
  //       modalDescriptionRef.current.style.color = 'rgb(255, 255, 255)'
  //       // bottomPadding.style.color = 'rgb(5, 5, 5)'

  //       // } else if (bgColor === 'grey') {
  //       //   bgRef.current.style.background = 'rgb(195, 195, 195)'
  //       //   modalRef.current.style.color = 'rgb(255, 255, 255)'
  //     } else {
  //       bgRef.current.style.background = 'rgb(250, 250, 250)'
  //       modalRef.current.style.color = 'rgb(0, 0, 0)'
  //       modalDescriptionRef.current.style.background = 'rgb(250, 250, 250)'
  //       modalDescriptionRef.current.style.color = 'rgb(0, 0, 0)'
  //     }
  //   }
  // }, [bgColor])

  if (openPressId === null) {
    return null
  } else {
    return ReactDom.createPortal(
      /* The entire modal has height = 110vh, meaning there's a little added space for scrolling at bottom */
      <div className="absolute top-0 h-[110vh] w-[100vw]">
        <div
          ref={bgRef}
          className="modal-background relative z-20 h-full w-full bg-zinc-50"
          style={MODAL_BG}
        />

        <div
          ref={modalRef}
          style={MODAL_REF}
          className="relative top-[-110vh] z-30 flex h-auto w-[100vw] flex-col items-center justify-start gap-0"
        >
          {/* NAVBAR */}
          <div className="modal-navbar-wrapper z-30 mt-5 flex w-full justify-center">
            <div className="modal-navbar flex w-[85%] max-w-[2400px] items-center justify-between gap-10 p-2 font-thin">
              {/* Button for closing modal, shared */}
              <button
                className="modal-navbar-back text-md duration-200 ease-out hover:scale-[1.1] sm:text-xl md:text-xl lg:text-2xl xl:text-3xl"
                onClick={closeModal}
              >
                <div className="film-modal-back flex items-center gap-1 text-base">
                  <BiLeftArrowAlt className="text-xl" />
                  <div className="text-base">BACK</div>
                </div>
              </button>

              <div className="flex items-center gap-2">
                <div className="text-xs font-thin md:text-sm xl:text-base">
                  {`${slideIndex + 1}/${film.pressGallery.numImages}`}
                </div>

                {/* Button for switching between Slides View and Gallery View, shared */}
                <button
                  className="text-md duration-200 ease-out hover:scale-[1.1] sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"
                  onClick={toggleView}
                >
                  {isGalleryView ? (
                    <TfiLayoutSlider className="m-[5px] text-xl" />
                  ) : (
                    <CgLayoutGridSmall className="text-3xl" />
                  )}
                </button>

                {/* Button for switching modal background colors (black, grey, white), shared*/}
                {/* <button
                  className="text-md border-2 border-orange-300 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"
                  onClick={toggleBackground}
                >
                  <PiSelectionBackgroundThin />
                </button> */}
              </div>
            </div>
          </div>

          {/* TITLE */}
          <div className="z-30 mb-10 flex w-full justify-center p-2 font-thin">
            <div className="modal-title capitalize normal-case">
              {film.pressGallery.title}
            </div>
          </div>

          {/* IMAGE DISPLAY WINDOW */}
          <div
            className="modal-content relative h-full w-full"
            style={MODAL_CONTENT}
          >
            {/* MODAL - VIEWING WINDOW */}
            <div
              ref={modalContentRef}
              className="modal-flexContainer relative flex h-full w-full justify-center"
            >
              {/* MODAL - LEFT BUTTON*/}
              <div className="modal-left-flexItem flex h-full w-[10%] max-w-[11rem] items-center justify-center">
                <button
                  ref={modal_slides_btnLeft}
                  className="text-md font-thin duration-200 ease-out hover:scale-[1.1] sm:text-xl md:text-3xl lg:text-4xl xl:text-6xl"
                  onClick={prevSlide}
                >
                  <BiChevronLeft />
                </button>
              </div>

              {/* MODAL - CENTER FRAME*/}
              <div className="modal-center-flexItem flex h-full w-[80%] max-w-[2400px] flex-30 items-center justify-center">
                {/* Slides View Mode */}
                <div ref={slidesRef} className="slides-all h-full w-full">
                  {film.pressGallery.imgList.map((slide) => (
                    <img
                      className="slides-each h-full w-full object-contain"
                      key={slide.id}
                      src={`${import.meta.env.BASE_URL}${slide.src}`}
                    />
                  ))}
                </div>

                {/* Gallery View Mode */}
                <div ref={galleryRef} className="gallery-all">
                  {film.pressGallery.imgList.map((img) => (
                    <img
                      className="gallery-each"
                      key={img.id}
                      src={`${import.meta.env.BASE_URL}${img.src}`}
                      onClick={() => handleGalleryClick(img.index)}
                    />
                  ))}
                </div>
              </div>

              {/* MODAL - RIGHT BUTTON*/}
              <div className="modal-right-flexItem flex h-full w-[10%] max-w-[11rem] items-center justify-center">
                <button
                  ref={modal_slides_btnRight}
                  className="text-md font-thin duration-200 ease-out hover:scale-[1.1] sm:text-xl md:text-3xl lg:text-4xl xl:text-6xl"
                  onClick={nextSlide}
                >
                  <BiChevronRight />
                </button>
              </div>
            </div>
          </div>

          {/* PHOTO DESCRIPTION (ONLY IN SLIDES MODE)*/}
          {!isGalleryView && (
            <div
              style={MODAL_DESC_REF}
              ref={modalDescriptionRef}
              className="relative z-30 mt-2 flex w-full items-center justify-center font-thin"
            >
              <div className="modal-description w-[80%] max-w-[1600px] p-3 text-xs">
                {film.pressGallery.imgList[slideIndex].description}
              </div>
            </div>
          )}
        </div>
      </div>,
      document.getElementById('portal'),
    )
  }
}
