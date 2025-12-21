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

      <div className="relative top-25 z-20 flex w-[100%] items-center justify-center overflow-hidden p-5">
        <h1 className="m-1 flex w-auto items-center justify-center overflow-hidden rounded-xl border-0 bg-zinc-50 p-4 font-black">
          FILM
        </h1>
      </div>

      <div className="relative top-40 flex items-center justify-center border-0">
        <Carousel filmsData={filmsData} numSlidesIndex={numSlidesIndex} />
      </div>

      <div className="relative bottom-0 h-[15rem]"></div>

      <Footer />
    </>
  )
}
