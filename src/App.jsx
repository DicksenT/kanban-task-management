import { useState } from 'react'
import mobileLogo from '/assets/logo-mobile.svg'
import chevronDown from '/assets/icon-chevron-down.svg'
import addTask from '/assets/icon-add-task-mobile.svg'
import ellipsis from '/assets/icon-vertical-ellipsis.svg'
import Board from './Board'

function App() {

  return (
    <div className='mainApp'>
      <header>
        <div className="left">
          <img src={mobileLogo} alt="" />
          <p className='currentBoard'>
            Platform Launch
            <img src={chevronDown} alt="" />
          </p>
        </div>
        <div className="right">
          <button className="addTask">
            <img src={addTask} alt="" className='addBtn'/>
          </button>
          <img src={ellipsis} alt="" className="ellipsis" />
        </div>
      </header>
      <main>
        <section className='boards'>
          <Board/>
        </section>
      </main>
    </div>
  )
}

export default App
