import React from 'react'
import ReactDom from 'react-dom'
import { BiLeftArrowAlt } from 'react-icons/bi'

// import { useState, useRef, useEffect } from 'react'

export default function ModalViewer({ film, openModalId, closeModal }) {
  /*************** CSS **************/
  const MODAL_BG = {
    zIndex: '4',
    position: 'fixed',
    top: '0%',
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.9)',
  }

  const MODAL_CONTENT = {
    zIndex: '5',
    position: 'absolute',
    textAlign: 'center',
    width: '90%',
    height: '90%',
    top: '5%', // = (100-height)/2
    left: '5%', // = (100-width)/2
    color: 'white',
  }

  /*************** STATES AND VARS **************/
  if (openModalId === null) {
    return null
  } else {
    return ReactDom.createPortal(
      <>
        <div className="modal-background" style={MODAL_BG} />
        <div
          className="modal-content flex items-center justify-center"
          style={MODAL_CONTENT}
        >
          <div className="flex h-[500px] w-[888px] flex-col items-start justify-center gap-2">
            <div
              className="film-modal-close flex w-[20%] items-center justify-start p-2 font-bold"
              onClick={closeModal}
            >
              <BiLeftArrowAlt className="text-xl" />
              <div className="text-base">BACK</div>
            </div>

            {film?.youtube && (
              <div className="h-full w-full">
                <iframe
                  width="100%"
                  height="100%"
                  src={film.youtube}
                  title="YouTube video player"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </>,
      document.getElementById('portal'),
    )
  }
}
