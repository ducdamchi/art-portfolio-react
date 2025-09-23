import './App.css'
import NavSection from './Components/NavSection'
// import Home from './Components/Home/Home';
import Photography from './Components/Photography/Photography'
import Photo_Landing from './Components/Photography/Photo_Landing'
import Film from './Components/Film/Film'
import Film_Landing from './Components/Film/Film_Landing'
import Woodworking from './Components/Woodworking/Woodworking'
import About from './Components/About/About'
import Contact from './Components/Contact/Contact'

import { Route, Routes } from 'react-router-dom'

export default function App() {
  return (
    <div className="routes-container">
      <Routes>
        <Route path="/" element={<Photography />} />
        <Route path="/photography" element={<Photography />} />
        <Route path="/photography/:photoURL" element={<Photo_Landing />} />
        <Route path="/film" element={<Film />} />
        <Route path="/film/:filmURL" element={<Film_Landing />} />
        <Route path="/woodworking" element={<Woodworking />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  )
}
