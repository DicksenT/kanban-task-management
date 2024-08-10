import { useEffect, useState } from "react"
import mobileLogo from '/assets/logo-mobile.svg'
import chevronDown from '/assets/icon-chevron-down.svg'
import addTaskLogo from '/assets/icon-add-task-mobile.svg'
import ellipsis from '/assets/icon-vertical-ellipsis.svg'
import { useLocation } from "react-router-dom"

function Header(props){
    const {setAddTask, 
            setDeleteBoard, setEditBoard, 
            currBoard, setDarkMode, 
            setSelectBoard, selectBoard, setCurrBoard,
            setType} = props
    const [ellipsisClicked, setEllipsisClicked] = useState(false)

    const location = useLocation()
    useEffect(()=>{
        setCurrBoard(decodeURIComponent(location.pathname).slice(1))
    },[location])

    const handleEditBoard = () =>{
      setEditBoard(true)
      setType('edit')
    }

    return(
    <>
    <header className={selectBoard ? 'zindex' : ''}>
        <div className="left">
          <img src={mobileLogo} alt="" />
          <div className='currentBoard' onClick={() =>setSelectBoard(prevState =>!prevState)}>
            <p>{currBoard}</p>
            <img src={chevronDown} alt="" />
          </div>
        </div>
        <div className="right">
          <button className="addTask" onClick={() => setAddTask(true)}>
            <img src={addTaskLogo} alt="" className='addBtn'/>
          </button>

          <div className="taskSetting">
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