import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Film.css'

export default function Carousel_Items({
  filmsData,
  carouselIndex,
  isEdgeTransition,
}) {
  /*************** CSS **************/
  const FILM_FLEX_CONTAINER = {
    transform: `translateX(calc(${carouselIndex} * -100%))`,
    transition: isEdgeTransition ? 'none' : 'transform 750ms ease-in-out',
  }

  /*************** STATES AND VARS **************/
  /* store which album was clicked on */
  const [openModalId, setOpenModalId] = useState(null)

  /*************** HOOKS & FUNCTIONS **************/

  return (
    <div
      className="film-container flex h-[100%] w-auto items-center text-black"
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
              <div className="poster m-2 h-auto w-[100%] max-w-[400px] p-2">
                <img
                  id="poster-0"
                  className="h-full w-full object-contain"
                  src={`${import.meta.env.BASE_URL}${film.poster}`}
                />
              </div>
            </div>
          ),
      )}

      {/* Real slides */}
      {filmsData.map((film) => (
        <div
          className="film-object flex h-full w-[100%] shrink-[0] items-center justify-center"
          key={film.id}
          id={`film-object-${film.id}`}
        >
          <div className="poster m-2 h-auto w-[100%] max-w-[400px] p-2">
            <Link
              to={`../film/${film.url}`}
              className="absolute h-full w-full"
            />
            <img
              id={`poster-${film.id}`}
              className="h-full w-full object-contain"
              src={`${import.meta.env.BASE_URL}${film.poster}`}
            />
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
              <div className="poster m-2 h-auto w-[100%] max-w-[400px] p-2">
                <img
                  className="h-full w-full object-contain"
                  src={`${import.meta.env.BASE_URL}${film.poster}`}
                  id={`poster-${filmsData.length + 1}`}
                />
              </div>
            </div>
          ),
      )}
    </div>
  )
}
