import { useEffect, useState } from 'react'
import mobileLogo from '/assets/logo-mobile.svg'
import chevronDown from '/assets/icon-chevron-down.svg'
import addTask from '/assets/icon-add-task-mobile.svg'
import ellipsis from '/assets/icon-vertical-ellipsis.svg'
import Board from './Board'
import axios from 'axios'

function App() {
  const [data, setData] = useState()
  useEffect(()=>{
    const getData = async() =>{
      try{
        const response = await axios.get('data.json')
        setData(response.data.boards)
      }
      catch(e){
        console.error(e);
      }
    }
    getData()
  },[])
  useEffect(() =>{
    setData(data)
  },[data])
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
        {data && <Board data={data[0]}/>}
        </section>
      </main>
    
    </div>
  )
}

export default App
