import boardLogo from '/assets/icon-board.svg'
import lightLogo from '/assets/icon-light-theme.svg'
import darkLogo from '/assets/icon-dark-theme.svg' 
import { useEffect, useRef, useState } from 'react'
import {Link, useLocation} from 'react-router-dom'
function BoardSelect(props){
    const taskBg = useRef(null)
    const {data, setDarkMode, setSelectBoard,setCurrBoard, currBoard, setEditBoard, setType} = props

    useEffect(() =>{
        const handleClick = (e) =>{
            if(taskBg.current && taskBg.current === e.target){
                setSelectBoard(false)
            }
        }
        window.addEventListener('click', handleClick)
        return()=>{
            window.removeEventListener('click', handleClick)
        }
    },[])

    const handleCreate = () =>{
      setEditBoard(true)
      setSelectBoard(false)
      setType('create')
    }


    const location = useLocation()
    useEffect(()=>{
        setCurrBoard(decodeURIComponent(location.pathname).slice(1));
    },[location]) 
    return(
        <div className='taskBackground boardBg' ref={taskBg}>
          <div className="taskDetails boardDetails">
            <h4>All Boards({data.length})</h4>
            <ul className='boardsList'>
              {data.map((board) =>(
                <Link to={`/${board.name}`}>
                <li className={board.name == currBoard ? 'boardList boardActive' : 'boardList'} onClick={() => setCurrBoard(board.name)}>
                  <img src={boardLogo} alt="" />
                  {board.name}
                </li>
                </Link>
              ))}
              <li className='boardList' onClick={handleCreate}>
                  <img src={boardLogo} alt="" />
                  <p className='createBoard'>+Create New Board</p>
              </li>
            </ul>
            <div className="dark">
              <img src={lightLogo} alt="" />
              <label className='switch'>
                <input type="checkbox" className='checkbox' onChange={() => setDarkMode(prevState => !prevState)}/>
                <span className="toggle"></span>
              </label>
              <img src={darkLogo} alt="" />
            </div>

          </div>
          
          </div>
    )
}
export default BoardSelect