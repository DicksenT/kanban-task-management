import boardLogo from '/assets/icon-board.svg'
import lightLogo from '/assets/icon-light-theme.svg'
import darkLogo from '/assets/icon-dark-theme.svg' 
import { useContext, useEffect, useRef, useState } from 'react'
import {Link, useLocation} from 'react-router-dom'
import sidebarLight from '/assets/logo-light.svg'
import sidebarDark from '/assets/logo-dark.svg'
import hideSidebar from '/assets/icon-hide-sidebar.svg'
import { kanbanContext } from '../context/KanbanContext'


function BoardSelect(props){
    const taskBg = useRef(null)
    const {setSelectBoard,setEditBoard, 
          setType, width} = props
    const {state, dispatch} = useContext(kanbanContext)
    
    /* close the boardSelect or popup when click the background */
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


    /* Set another component to active or popup when this function active, which in here to create new Board and set the type */
    const handleCreate = () =>{
      setEditBoard(true)
      setType('create')
      if(!width){
        /*prevent sidebard to close*/
        setSelectBoard(false)
      }
    }  
    return(
        <div className={width ? 'sidebar' : 'taskBackground'} ref={taskBg}>
          <div className={`taskDetails boardDetails ${state.darkMode && 'dark'}`}>
            <div className="boardDetailsContainer">
              {width ? 
              <div className="logoContainer">
                <img src={state.darkMode ? sidebarLight : sidebarDark} alt="" className='sidebarLogo'/>
              </div> 
              : ''}
              <Link to={'/dashboard'}>
              <h4 className='boardList dashboardSelect' onClick={() => setSelectBoard(false)}>Dashboard</h4>
              </Link>
              <h4>All Boards({state.boards.length})</h4>
              <ul className='boardsList boardSelect'>
                {state.boards && state.boards.map((board) =>(
                  <Link to={`/${board.name}`}>
                  <li className={board.name === state.currBoard.name ? 'boardList boardActive' : 'boardList'}>
                    <img src={boardLogo} alt="" />
                    {board.name}
                  </li>
                  </Link>
                ))}
              </ul>
              <div className='boardList' onClick={handleCreate}>
                    <img src={boardLogo} alt="" />
                    <p className='createBoard'>+Create New Board</p>
                </div>
            </div>
            <div className="darkModeContainer">
              <div className="darkModeBtn">
                <img src={lightLogo} alt="" />
                <label className='switch pointer'>
                  <input type="checkbox" className='checkbox' onChange={() => dispatch({type:'SET_DARKMODE'})}/>
                  <span className="toggle"></span>
                </label>
                <img src={darkLogo} alt="" />
              </div> 
              {width && 
              <div className='hideSidebar pointer' onClick={() => setSelectBoard(false)}>
                <img src={hideSidebar} alt="" />
                <p>Hide Sidebar</p>
              </div>}
            </div>

          </div>
          
          </div>
    )
}
export default BoardSelect