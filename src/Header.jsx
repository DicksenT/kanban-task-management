import { useContext, useEffect, useRef, useState } from "react"
import mobileLogo from '/assets/logo-mobile.svg'
import chevronDown from '/assets/icon-chevron-down.svg'
import addTaskLogo from '/assets/icon-add-task-mobile.svg'
import ellipsis from '/assets/icon-vertical-ellipsis.svg'
import { useLocation } from "react-router-dom"
import logoLight from '/assets/logo-light.svg'
import logoDark from '/assets/logo-dark.svg'
import { kanbanContext } from "./context/KanbanContext"

function Header(props){
    const {setAddTask, setDeleteBoard, setEditBoard, 
            setSelectBoard, selectBoard, 
            setType,  width} = props
    const [ellipsisClicked, setEllipsisClicked] = useState(false)
    const {state, dispatch} = useContext(kanbanContext)

    /* set currBoard based on url location */
    const location = useLocation()
    useEffect(()=>{
        dispatch({type:'SET_CURRBOARD', payload:decodeURIComponent(location.pathname).slice(1)})
    },[location])

    const handleEditBoard = () =>{
      setEditBoard(true)
      setType('edit')
    }

    const headerEllipsis = useRef(null)

    /* close the ellipsis drop down menu when clicked other than headerEllipsis ref or anything contains in it or it's childern */
    useEffect(() =>{
      const handleClick = (e) =>{
        if(headerEllipsis.current && !headerEllipsis.current.contains(e.target))
        setEllipsisClicked(false)
      }
      window.addEventListener('click', handleClick)
      return() =>{
        window.removeEventListener('click', handleClick)
      }
    },[])
    
    return(
    <>
    <header className={`${selectBoard && width < 768 ? 'zindex' : ''} ${state.darkMode && 'dark' }`}>
        <div className="left">
          {selectBoard ? 
            <p>{state.currBoard}</p>
          :
          (width >= 768 ?
            (<div className="headerLogo">
            <img onClick={() => setSelectBoard(true)} className="headerImg" src={state.darkMode ? logoLight : logoDark} alt="" />
            <p>{state.currBoard}</p>
            </div>)
            :
            <>
          <img src={mobileLogo} alt="" />
          <div className='currentBoard' onClick={() =>setSelectBoard(prevState =>!prevState)}>
            <p>{state.currBoard}</p>
            <img src={chevronDown} alt="" />
          </div> 
          </>
          )
          
          }
          
        </div>
        <div className="right">
          <button className={`addTask ${width >=768 && 'addTaskWidth'}`} onClick={() => setAddTask(true)}>
            <img src={addTaskLogo} alt="" className='addBtn'/>
            {width >= 768 && <p>Add New Task</p>}
          </button>

          <div className="taskSetting" ref={headerEllipsis}>
            <img src={ellipsis} alt="" className="ellipsis" onClick={() => setEllipsisClicked(prevState => !prevState)}/>
            {ellipsisClicked && <div className="settingSelect">
              <p onClick={handleEditBoard}>Edit</p>
              <p onClick={() => setDeleteBoard(true)} className="red">Delete</p>
            </div>}
          </div>
        </div>
      </header>
      </>
    )
}
export default Header