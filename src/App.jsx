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
    if(data){
      setCurrBoard(data[0].name)
    }
  },[data])

  const [currBoard, setCurrBoard] = useState()

  const handleSubtaskClick = (currColumn, currTask, currSubtask) =>{
    const updatedData = data.map((board) =>{
      if (board.name == currBoard){
        return{
          ...board,
          columns: board.columns.map(column =>{
            if (column.name == currColumn){
              return{
                ...column,
                tasks: column.tasks.map(task =>{
                  if(task.title == currTask){
                    return{
                      ...task,
                      subtasks: task.subtasks.map(subtask => {
                        if(subtask.title == currSubtask){
                          return{
                            ...subtask,
                            isCompleted: !subtask.isCompleted
                          }
                        }
                        return subtask
                      })
                    }
                  }
                  return task
                })
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
        {data && <Board data={data[0]} handleSubtaskClick={handleSubtaskClick}/>}
        </section>
      </main>
    
    </div>
  )
}

export default App
