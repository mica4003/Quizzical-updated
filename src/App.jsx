import React from "react"
import { useState } from 'react'
import yellowlogo from './assets/yellow.svg'
import bluelogo from './assets/blue.svg'
import Initial from "./Initial.jsx"
import Questions from "./Questions.jsx"


export default function App() {
  const[isInitialized, setIsinitialized] = useState(false)
  function startQuizz(){
    setIsinitialized(true)
  }
  return ( 
      <div>
          <img src={bluelogo} className="bluelogo"/>
          {isInitialized?<Questions />: <Initial startQuizz={startQuizz}/>}
          <img src={yellowlogo} className="yellowlogo"/>
      </div>
  )
}

