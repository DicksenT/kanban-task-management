import { useContext, useEffect, useRef, useState } from "react"
import mobileLogo from '/assets/logo-mobile.svg'
import chevronDown from '/assets/icon-chevron-down.svg'
import addTaskLogo from '/assets/icon-add-task-mobile.svg'
import ellipsis from '/assets/icon-vertical-ellipsis.svg'
import { useLocation } from "react-router-dom"
import logoLight from '/assets/logo-light.svg'
import logoDark from '/assets/logo-dark.svg'
import { kanbanContext } from "../context/KanbanContext"
import Confirm from "./Confim"
import { authContext } from "../context/AuthContext"
import LogoutConfirm from "./LogoutConfirm"



function Header(props){
    const {setAddTask, setEditBoard, 
            setSelectBoard, selectBoard, 
            setType,  width} = props
    const [ellipsisClicked, setEllipsisClicked] = useState(false)
    const {state, dispatch} = useContext(kanbanContext)
    const {state:userState, dispatch:userDispatch} = useContext(authContext)
    const [onDashboard, setOnDashboard] = useState(false)
 
    /* set currBoard based on url location */
    const location = useLocation()
    useEffect(()=>{
      const locName = decodeURIComponent(location.pathname).slice(1)          
      const match = state.boards.find(board=>board.name == locName)
      console.log(locName);
            
      if(match){         
        console.log(match);
        
        dispatch({type:'SET_CURRBOARD', payload:match})
      }
      if(locName === 'dashboard'){
        setOnDashboard(true)
      }
      else if(locName !== 'dashboard'){
        setOnDashboard(false)
      }
    },[location, state.boards])

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

    const [deleteBoard, setDeleteBoard] = useState(false)

    const [clickEmail, setClickEmail] = useState(true)

    const emailRef = useRef()
    useEffect(() =>{
      const handleClick = (e) =>{
        if(emailRef.current && !emailRef.current.contains(e.target)){
          setClickEmail(false)
        }
      }

      window.addEventListener('click', handleClick)
      return() => {
        window.removeEventListener('click',handleClick)
      }
    },[])

    const [logout, setLogout] = useState(false)

    return(
    <>
    <header className={`${selectBoard && width < 768 ? 'zindex' : ''} ${state.darkMode && 'dark' }`}>
        <div className="left">
          {selectBoard ? 
            <p>{state.currBoard && state.currBoard.name}</p>
          :
          (width >= 768 ?
            (<div className="headerLogo">
            <img onClick={() => setSelectBoard(true)} className="headerImg" src={state.darkMode ? logoLight : logoDark} alt="" />
           {!onDashboard && <p>{state.currBoard ? state.currBoard.name : 'Select Board'}</p>}
            </div>)
            :
            <>
          <img src={mobileLogo} alt="" />
          <div className='currentBoard' onClick={() =>setSelectBoard(prevState =>!prevState)}>
            {onDashboard ?  '':
            <>
              <p>{state.currBoard ? state.currBoard.name : 'Select Board'}</p>
              <img src={chevronDown} alt="" />
            </>
            }
          </div> 
          </>
          )
          
          }
          
        </div>
        <div className="right">
          {!onDashboard && <button className={`addTask ${width >=768 && 'addTaskWidth'}`} onClick={() => setAddTask(true)}>
            <img src={addTaskLogo} alt="" className='addBtn'/>
            {width >= 768 && <p>Add New Task</p>}
          </button>}
          

          {onDashboard && 
          <div className="userDropdown" ref={emailRef} onClick={() => setClickEmail(prevState => !prevState)}>
            <p>{userState.user.user}</p>
            {clickEmail && <div className="userClick">
              <p className="red" onClick={() => setLogout(true)}>Logout</p>
            </div>}
          </div>}

          {logout && <LogoutConfirm setConfirm={setLogout}/>}

          <div className="taskSetting" ref={headerEllipsis}>
            <img src={ellipsis} alt="" className="ellipsis" onClick={() => setEllipsisClicked(prevState => !prevState)}/>
            {ellipsisClicked && <div className="settingSelect">
              <p onClick={handleEditBoard}>Edit</p>
              <p onClick={() => setDeleteBoard(true)} className="red">Delete</p>
             </div>}
          </div>
        </div>
      </header>

      {deleteBoard && <Confirm type='board' setConfirm={setDeleteBoard}/>}
      </>
    )
}
export default Header