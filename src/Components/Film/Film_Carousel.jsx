import React from 'react'
import { useState, useRef, useEffect } from 'react'
import './Film.css'
import Carousel_Items from './Film_Items'

export default function Carousel({ filmsData, numSlidesIndex }) {
  /*************** STATES AND VARS **************/
  const [carouselIndex, setCarouselIndex] =
    useState(1) /* slide index we're on */
  const [isEdgeTransition, setEdgeTransition] =
    useState(false) /* handling Edge case transition */
  const [rightDisabled, setRightDisabled] =
    useState(false) /* disabling next button */
  const [leftDisabled, setLeftDisabled] =
    useState(false) /* disabling previous button */
  // const [slidesOffset, setSlidesOffset] = useState(0);
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
      setTimeout(() => {
        setEdgeTransition(true)
        setCarouselIndex(1)
      }, 700)
    } else if (newIndex === 0) {
      /* Sliding left near the first slides */
      setTimeout(() => {
        setEdgeTransition(true)
        setCarouselIndex(numSlidesIndex - 1)
      }, 700)
    }
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

  /*************** HTML **************/
  return (
    <div className="film-carousel-whole">
      {/* Left side button */}
      <div className="z-[3] flex h-full flex-1 items-center justify-center bg-[rgb(250,250,250)]">
        <button
          ref={carouselBtnLeft}
          className="film-carousel-btn film-carousel-btn-left"
          onClick={prevSlide}
          disabled={leftDisabled}
        >
          <div>&#8249;</div>
        </button>
      </div>

      <div className="z-[2] h-full flex-5">
        <Carousel_Items
          filmsData={filmsData}
          carouselIndex={carouselIndex}
          isEdgeTransition={isEdgeTransition}
          carouselBtnLeft={carouselBtnLeft}
          carouselBtnRight={carouselBtnRight}
        />
      </div>

      {/* Right side button */}
      <div className="z-[3] flex h-full flex-1 items-center justify-center bg-[rgb(250,250,250)]">
        <button
          ref={carouselBtnRight}
          className="film-carousel-btn film-carousel-btn-right"
          onClick={nextSlide}
          disabled={rightDisabled}
        >
          <div>&#8250;</div>
        </button>
      </div>
    </div>
  )
}
