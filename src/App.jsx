import { useContext, useEffect, useRef, useState } from 'react'
import Board from './Board'
import axios from 'axios'
import {useLocation,Link,Navigate,BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import EditBoard from './EditBoard'
import BoardSelect from './BoardSelect'
import ManageTask from './ManageTask'
import Header from './Header'
import Confirm from './Confim'
import openSide from '/assets/icon-show-sidebar.svg'
import { kanbanContext } from './context/KanbanContext'

function App() {
  const {state, dispatch} = useContext(kanbanContext)
  const [data, setData] = useState()
  const [addTask, setAddTask] = useState(false)

  useEffect(()=>{
    const getData = async() =>{
      try{
        const response = await fetch('https://kanban-task-management-web-app-86h6.onrender.com/kanban')
        const json = await response.json()
        if(response.ok){
          dispatch({type:'SET_DATA', payload:json})
          console.log(state.boards);
          
        }
      }
      catch(e){
        console.error(e);
      }
    }
    getData()
  },[])


  useEffect(()=>{
    if(state.boards){
    console.log(state.boards);
    }
  },[state])

  /* List of all Function where it mapped Json to change the value */

  const handleChangeStatus = (newStatus, currStatus, selectTask) =>{   
    const updatedData = data.map((board) =>{
      if (board.name == currBoard){
        return{
          ...board,
          columns: board.columns.map((column)=>{
            if(column.name == currStatus){
              return{
                ...column,
                tasks: column.tasks.filter(task => task != selectTask)
              }
            }
            if(column.name == newStatus){
              return{
                ...column,
                tasks: [...column.tasks, selectTask]
              }
            }
            return column
          })
        }
      }
      return board
    })
    setData(updatedData)
  }

  /* get all column or status on currBoard */
  const [statues, setStatues] = useState()
  useEffect(() =>{    
    const getStatues = () =>{
      const statusList = []
      if(data){
        data.map(board =>{
          if(board.name === state.currBoard){
            board.columns.forEach((column) =>{
              statusList.push(column)
            })
          }
        })
      }
      
      setStatues(statusList) 
    }
    getStatues()     
  },[data, state.currBoard])


  const [editBoard, setEditBoard] = useState(false)
  const [selectBoard, setSelectBoard] = useState(false)
  const [type, setType] = useState()
  const [deleteBoard, setDeleteBoard] = useState(false)

  useEffect(() =>{
    if(state.darkMode){
      document.body.classList.add('darkBg')
    }
    else{
      document.body.classList.remove('darkBg')
    }
  },[state.darkMode])

  /* Update the width when window resizing */
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() =>{
    const handleWidth = () =>{
      setWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleWidth)
    return()=>{
      window.removeEventListener('resize',handleWidth)
    }
  },[])
  

  /*Function For Drag Scrolling*/
  const containerRef = useRef(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startY = useRef(0)
  const scrollLeft = useRef(0)
  const scrollTop = useRef(0)


  /*Run When mouse is Clicked,
  Start x and y is to know location of the cursor where
  pageX/Y is where it located in the screen minus where container is located
  
  scroll is to know how far the container been scrolled X/Y axis*/
  const handleMouseDown = (e) =>{
    isDragging.current = true
    startX.current = e.pageX - containerRef.current.offsetLeft
    startY.current = e.pageY - containerRef.current.offsetTop
    scrollLeft.current = containerRef.current.scrollLeft
    scrollTop.current = containerRef.current.scrollTop
    containerRef.current.style.cursor = 'grabbing'
  }
  const handleMouseUp = () =>{
    isDragging.current = false

  }
  const handleMouseLeave = () =>{
    isDragging.current = false

  }
  const handleMouseMove = (e) =>{
    if(!isDragging.current) return

    const x = e.pageX - containerRef.current.offsetLeft
    const y = e.pageY - containerRef.current.offsetTop
    const walkX = x - startX.current
    const walkY = y - startY.current

    containerRef.current.scrollLeft = scrollLeft.current - walkX
    containerRef.current.scrollTop = scrollTop.current - walkY
  }

  return (
    <Router>
    {/* sidebar or boardSelect located here because >768 px layout */}
    <div className="sidebarAndMain">     
    {selectBoard && <BoardSelect 
                        setSelectBoard={setSelectBoard}
                        setEditBoard={setEditBoard}
                        setType={setType}
                        width={width >= 768}
                        />}

    <div className='mainApp'>
      <Header setSelectBoard={setSelectBoard} 
              setEditBoard={setEditBoard} 
              setAddTask={setAddTask}
              selectBoard={selectBoard}
              setType={setType}
              setDeleteBoard={setDeleteBoard} 
              width={width}/>
              
      
      <main ref={containerRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} 
      onMouseMove={handleMouseMove}>
          <section className='boards'>
        <Routes>
          <Route exact path='/' element={<Navigate replace to={`/${state.currBoard}`}/>}/>
        {/* mapped data so each board get the path based on their name */}
        {state.boards && state.boards.map((board) =>(
          <Route key={board.name} path={`/${board.name}`} 
            element={
              <Board data={board} 
              handleChangeStatus={handleChangeStatus}
              statues = {statues}
              width={width}
              setEditBoard={setEditBoard}
              setType={setType}/>}/>))}
        </Routes>
        </section>
        {selectBoard || width < 768 ? '':
        <div className='openSidebar pointer' onClick={() => setSelectBoard(true)}>
          <img src={openSide} alt="" />
        </div>}
      </main>
      </div>

      {/*Bunch of conditional rendering pop-up, should be okay to put it anywhere */}
      {editBoard && <EditBoard statues={statues} 
                    addBoard={addBoard}
                    setEditBoard={setEditBoard}
                    type={type}
                    />}
      
      {addTask && statues && <ManageTask type='add' statues={statues} 
      setTask={setAddTask}/>}
      {deleteBoard && <Confirm type={'board'} setConfirm={setDeleteBoard}/>}
    </div>
    </Router>
  )
}

export default App
