import { useState, useRef, useEffect } from 'react'
import NavSection from '../NavSection'
import Footer from '../Footer'
import '../../App.css'
import './About.css'

export default function About() {
  return (
    <>
      <NavSection />

      <div className="relative top-25 flex w-[100vw] items-center justify-center p-5">
        <h1 className="m-1 flex w-auto items-center justify-center overflow-hidden rounded-xl border-0 bg-zinc-50 p-4 font-black">
          ABOUT
        </h1>
      </div>

      <div className="about-text mt-30 flex h-auto items-center justify-center pb-30">
        <div className="relative flex h-auto w-[35%] max-w-[540px] min-w-[320px] flex-col gap-2 p-2">
          <img src="about/about.jpg" alt="" className="rounded-xl border-1" />
          <div className="rounded-xl border-1 bg-zinc-50 p-4">
            Duc Dam is a software developer born in Hanoi and based in
            Philadelphia. This portfolio showcases some of the things that he's
            up to in his free time.
          </div>
          <div className="rounded-xl border-1 bg-zinc-50 p-4">
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

      {/* <div className="relative bottom-0 z-0 h-[20rem] border-blue-500"></div> */}

      <Footer />
    </>
  )
}
