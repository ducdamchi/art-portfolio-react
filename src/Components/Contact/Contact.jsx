import { useState, useRef, useEffect } from 'react'
import NavSection from '../NavSection'
import Footer from '../Footer'
import '../../App.css'
import './Contact.css'
import Swal from 'sweetalert2'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const onSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)

    formData.append('access_key', '00355082-0749-4c04-8d55-ff78fa9fd483')

    const object = Object.fromEntries(formData)
    const json = JSON.stringify(object)

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: json,
    }).then((res) => res.json())

    if (res.success) {
      setSent(true)
      Swal.fire({
        title: 'Thanks for reaching out!',
        text: 'Your message has been received and Duc will get back to you as soon as possible.',
        confirmButtonText: 'Close',
      })
    }
  }

  useEffect(() => {}, [sent])

  return (
    <>
      <NavSection />

      <div className="relative top-25 flex w-[100vw] items-center justify-center p-5">
        <h1 className="m-1 flex w-auto items-center justify-center overflow-hidden rounded-xl border-0 bg-zinc-50 p-4 font-black">
          CONTACT
        </h1>
      </div>

      <div className="contact-all relative mt-30 mb-[4rem] flex h-auto w-full flex-col items-center justify-center gap-1">
        <div className="m-2 rounded-xl bg-zinc-50 p-4">
          For all inquiries, please contact Duc using the form below.
        </div>
        <div className="contact-form m-2 gap-1 border-1 p-7">
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="font-bold">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                autoComplete="name"
                className="border-1 bg-zinc-100 p-2"
                placeholder="Enter your name"
                required
              ></input>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="font-bold">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                className="border-1 bg-zinc-100 p-2"
                placeholder="Enter your email"
                required
              ></input>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="message" className="font-bold">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                className="message-box border-1 bg-zinc-100 p-2"
                placeholder="Enter message"
                required
              ></textarea>
            </div>
            <button
              className="submit-button w-[20%] self-end border-1 bg-zinc-100 p-2"
              type="submit"
            >
              <div className="submit-button-text">Send</div>
            </button>
          </form>
        </div>
      </div>

      {/* {(sent || !sent) && (
        <div className="absolute top-0 flex h-full w-full justify-center border-1">
          <div className="w-[300px] border-1 bg-zinc-50">Message Sent</div>
        </div>
      )} */}

      <div className="relative bottom-0 z-0 h-[20rem] border-blue-500"></div>

      <Footer />
    </>
  )
}
