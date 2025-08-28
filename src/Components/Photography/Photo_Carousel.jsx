import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

import '../../App.css'
import './Photography.css'
import Carousel_Items from './Photo_Items'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'

export default function Carousel({
  albumsData,
  numSlidesIndex,
  albumsPerSlide,
  oddAlbums,
  screenWidth,
}) {
  /*************** CSS **************/
  const CAROUSEL_WHOLE = {
    height: `calc((100% - 2 * var(--slider-padding)) / ${albumsPerSlide} * 0.666)`,
  }
  const CAROUSEL_BTN_STYLE = {
    // display: 'block',
    position: 'absolute',
    top: '0%',
    height: '100%',
    width: 'var(--slider-padding)',
    zIndex: '3',
    opacity: '1',
  }

  /*************** STATES AND VARS **************/
  const [carouselIndex, setCarouselIndex] = useState(1)
  /* slide index we're on */
  const [isEdgeTransition, setEdgeTransition] =
    useState(false) /* handling Edge case transition */
  const [rightDisabled, setRightDisabled] =
    useState(false) /* disabling next button */
  const [leftDisabled, setLeftDisabled] =
    useState(false) /* disabling previous button */
  const [slidesOffset, setSlidesOffset] = useState(0)
  const carouselBtnLeft = useRef(null)
  const carouselBtnRight = useRef(null)

  /*************** FUNCTIONS **************/
  /* Disable a button for time_ms miliseconds */
  function disableClickTemp(time_ms) {
    // Disable clicking until carousel fully loads
    setRightDisabled(true)
    setLeftDisabled(true)
    // console.log("Click disabled");

    // Enable clicking again
    setTimeout(() => {
      setRightDisabled(false)
      setLeftDisabled(false)
      // console.log("Click enabled");
    }, time_ms)
  }

  /* Handles edge case transitions */
  function handleEdgeCase(newIndex) {
    /* Sliding right near the last slides */
    if (newIndex === numSlidesIndex) {
      /* If there are odd albums */
      if (oddAlbums != 0) {
        /* Last slide -> first slide */
        if (oddAlbums != 0 && slidesOffset === 0) {
          // console.log('triggering slidesoffset')
          setSlidesOffset(oddAlbums / albumsPerSlide)
          setCarouselIndex(newIndex - 1)

          /* Second last slide -> last slide, show odd album */
        } else if (oddAlbums != 0 && slidesOffset != 0) {
          // wait for 750ms transition to be over, then use
          // 'none' transition from fake slide to real slide
          setTimeout(() => {
            setSlidesOffset(0)
            setEdgeTransition(true)
            setCarouselIndex(1)
          }, 700)
        }
        /* If there are no odd albums */
      } else {
        setTimeout(() => {
          setEdgeTransition(true)
          setCarouselIndex(1)
        }, 700)
      }
      /* Sliding left near the first slides */
    } else if (newIndex === 0) {
      /* If there are odd albums */
      if (oddAlbums != 0) {
        /* First slide -> last slide */
        if (slidesOffset === 0) {
          // console.log('triggering slidesoffset')
          // wait for 750ms transition to be over, then use
          // 'none' transition from fake slide to real slide
          setTimeout(() => {
            setSlidesOffset(oddAlbums / albumsPerSlide)
            setEdgeTransition(true)
            setCarouselIndex(numSlidesIndex - 1)
          }, 700)
          /* Second slide -> first slide, show odd album */
        } else {
          setSlidesOffset(0)
          setCarouselIndex(newIndex + 1)
        }

        /* If there are no odd albums */
      } else {
        setTimeout(() => {
          setEdgeTransition(true)
          setCarouselIndex(numSlidesIndex - 1)
        }, 700)
      }
    }

    // // If reached second to last real slide
    // else if (newIndex == numSlidesIndex) {
    //   console.log('triggering slidesoffset');
    //   setSlidesOffset(oddAlbums / albumsPerSlide);
    //   setCarouselIndex(newIndex);
    // }
  }

  /* Handles user right button clicks */
  function nextSlide() {
    if (!rightDisabled) {
      // Disable click to prevent spam
      disableClickTemp(1000)
      setCarouselIndex((prevIndex) => {
        const newIndex = prevIndex + 1

        // If meet edge case, pass to function to handle transition
        handleEdgeCase(newIndex)

        // return newIndex regardless
        return newIndex
      })
    }
  }

  /* Handles user left button clicks */
  function prevSlide() {
    if (!leftDisabled) {
      // Disable click to prevent spam
      disableClickTemp(1000)
      setCarouselIndex((prevIndex) => {
        const newIndex = prevIndex - 1

        // If meet edge case, pass to function to handle transition
        handleEdgeCase(newIndex)

        // return newIndex regardless
        return newIndex
      })
    }
  }

  /*************** HOOKS **************/
  /* Update function for whenever carouselIndex changes, or edgeTransition flag is set */
  useEffect(() => {
    if (isEdgeTransition) {
      setTimeout(() => {
        setEdgeTransition(false)
      }, 300)
    }
    // console.log("Carousel index: " + carouselIndex);
  }, [isEdgeTransition, carouselIndex])

  // useEffect(() => {
  //   console.log('******* RESIZE DETECTED *******')
  //   console.log('carouselIndex:', carouselIndex)
  //   console.log('numSlidesIndex:', numSlidesIndex)
  //   console.log('albumsPerSlide:', albumsPerSlide)
  //   console.log('oddAlbums:', oddAlbums)
  //   console.log('slidesOffset:', slidesOffset)
  //   // const oldSlidesOffset = slidesOffset
  //   /* If upon resize (often from smaller to bigger screen), the stored carousel index exceed the number of real slides (all slides - 2), then set carouselIndex to the highest possible real slide index. */
  //   if (carouselIndex > numSlidesIndex - 1) {
  //     //Highest possible real slide index will be total number of slides minus 1
  //     setCarouselIndex(numSlidesIndex - 1)
  //     // if (oddAlbums !== 0) {
  //     //   setSlidesOffset(0)
  //     // }
  //   }
  //   /* If caught resizing on last page of carousel with odd albums, set slidesOffset to 0 to prevent any glitch in carousel*/
  //   // if (carouselIndex === numSlidesIndex - 1 && oddAlbums !== 0) {
  //   //   setSlidesOffset(0)
  //   // }
  //   // if (slidesOffset !== 0) {
  //   //   setSlidesOffset(0)
  //   // }
  //   // if (carouselIndex > numSlidesIndex - 2) {
  //   //   console.log('Carousel Index exceeded num slides Index')
  //   //   setCarouselIndex(1)
  //   // }
  //   // return () => {
  //   //   setSlidesOffset(oddAlbums / albumsPerSlide)
  //   // }
  // }, [numSlidesIndex])

  /*************** HTML **************/
  return (
    <div className="carousel-whole" style={CAROUSEL_WHOLE}>
      {/* Left side button */}
      <div>
        <div className="carousel-btn-bg btn-bg-left"></div>
        <button
          ref={carouselBtnLeft}
          style={CAROUSEL_BTN_STYLE}
          className="carousel-btn carousel-btn-left flex items-center justify-center"
          onClick={prevSlide}
          disabled={leftDisabled}
        >
          <BiChevronLeft />
        </button>
      </div>

      <Carousel_Items
        albumsData={albumsData}
        carouselIndex={carouselIndex}
        setCarouselIndex={setCarouselIndex}
        slidesOffset={slidesOffset}
        setSlidesOffset={setSlidesOffset}
        isEdgeTransition={isEdgeTransition}
        albumsPerSlide={albumsPerSlide}
        carouselBtnLeft={carouselBtnLeft}
        carouselBtnRight={carouselBtnRight}
        screenWidth={screenWidth}
      />

      {/* Right side button */}
      <div>
        <div className="carousel-btn-bg btn-bg-right"></div>
        <button
          ref={carouselBtnRight}
          style={CAROUSEL_BTN_STYLE}
          className="carousel-btn carousel-btn-right flex items-center justify-center"
          onClick={nextSlide}
          disabled={rightDisabled}
        >
          <BiChevronRight />
        </button>
      </div>
    </div>
  )
}
