import React from "react"
import { useState } from 'react'

export default function Initial(props) {
  return ( 
      <div className="initial-page">
          <h3>Quizzical</h3>
          <p>Some description if needed</p>
          <button className="start-btn" onClick={props.startQuizz}>Start quiz</button>
      </div>
  )
}