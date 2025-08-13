import { useState, useRef, useEffect } from 'react'

import NavSection from '../NavSection'
import Footer from '../Footer'
import '../../App.css'

export default function About() {
  return (
    <>
      <NavSection />

      <div className="relative top-10 flex w-[100vw] items-center justify-center p-5">
        <h1 className="m-1 flex items-center justify-center p-1 font-semibold">
          ABOUT
        </h1>
      </div>

      <div className="about-text mb-[4rem] flex items-center justify-center">
        <div className="relative top-20 flex h-[90vh] w-[35%] max-w-[800px] min-w-[360px] flex-col gap-2 p-2">
          <img src="about/about.jpg" alt="" />
          <div className="border-green-500 p-2">
            Duc Dam is a Vietnamese filmmaker, photographer, and web designer
            based in Hanoi and Philadelphia. For all inquries, please contact
            via email.
          </div>
          <div className="border-green-500 p-2">
            <div>
              EDUCATION: <br />
            </div>
            <div className="ml-5">
              Swarthmore College, B.A. Computer Science and Chinese <br />
              Mahindra United World College in India, International
              Baccalaureate
            </div>
          </div>
          <div className="border-green-500 p-2">
            <div>
              EVENTS: <br />
            </div>
            <div className="ml-5">
              A Short Film About Loving (2021) past screenings: <br />
            </div>
            <div className="ml-8">
              &#x2022; 2020 Cannes Indie Shorts Awards, Cannes, France <br />
              &#x2022; OKIA Outdoor Cinema, Hanoi, Vietnam <br />
              &#x2022; Fulbright University, HCMC, Vietnam <br />
              &#x2022; Mahindra United World College, Pune, India
            </div>
          </div>
        </div>
      </div>

      <div className="relative bottom-0 z-0 h-[20rem] border-blue-500"></div>

      <Footer />
    </>
  )
}
