import { useState, useRef, useEffect } from 'react'
import NavSection from '../NavSection'
import filmsData from './films.json'
import Carousel from './Film_Carousel'
import Footer from '../Footer'

export default function Film() {
  const [numSlidesIndex, setNumSlidesIndex] = useState(null)

  useEffect(() => {
    setNumSlidesIndex(filmsData.length + 2 - 1)
  }, [filmsData])

  return (
    <>
      <NavSection />

      <div className="relative top-10 z-20 flex w-[100%] items-center justify-center overflow-hidden p-5">
        <h1 className="m-1 flex w-[100vw] items-center justify-center overflow-hidden p-1 font-semibold">
          FILM
        </h1>
      </div>

      <div className="relative top-25 flex items-center justify-center border-0">
        <Carousel filmsData={filmsData} numSlidesIndex={numSlidesIndex} />
      </div>

      <div className="relative bottom-0 h-[15rem]"></div>

      <Footer />
    </>
  )
}
