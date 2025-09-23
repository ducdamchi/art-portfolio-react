import { useState, useRef, useEffect } from 'react'
import NavSection from '../NavSection'
import Footer from '../Footer'
import '../../App.css'
import './About.css'

export default function About() {
  return (
    <>
      <NavSection />

      <div className="relative top-10 flex w-[100vw] items-center justify-center p-5">
        <h1 className="m-1 flex items-center justify-center p-1 font-semibold">
          ABOUT
        </h1>
      </div>

      <div className="about-text mt-[4rem] mb-[4rem] flex h-auto items-center justify-center">
        <div className="relative flex h-[90vh] w-[35%] max-w-[540px] min-w-[320px] flex-col gap-2 p-2">
          <img src="about/about.jpg" alt="" className="border-3" />
          <div className="p-2">
            Duc Dam is a Vietnamese filmmaker and photographer born in Hanoi and
            based in Philadelphia. This online portfolio marks the beginning of
            his journey into web development, something you'll find him doing
            when not working on a production.
          </div>
          <div className="p-2">
            <div>
              EDUCATION: <br />
            </div>
            <div className="ml-5">
              Swarthmore College | BA - Computer Science and Chinese <br />
              Mahindra United World College in India | IB - Math, Philosophy,
              Film Studies
            </div>
          </div>
          {/* <div className="p-2">
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
          </div> */}
        </div>
      </div>

      <div className="relative bottom-0 z-0 h-[20rem] border-blue-500"></div>

      <Footer />
    </>
  )
}
