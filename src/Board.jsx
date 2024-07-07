import { useEffect, useRef, useState } from "react"
import ellipsis from '/assets/icon-vertical-ellipsis.svg'
import chevronDown from '/assets/icon-chevron-down.svg'
import chevronUp from '/assets/icon-chevron-up.svg'

function Board(props){
    const {data, handleSubtaskClick} = props
    const [taskClicked, setTaskClicked] = useState(false)
    const taskDetails= useRef(null)
    const [currentTask, setCurrentTask] = useState()
    const [currentStatus, setCurrentStatus] = useState()

    const openTask = (task, status) =>{
        setTaskClicked(true)
        setCurrentTask(task.title)
        setCurrentStatus(status)
        console.log(currentStatus);
    }

    useEffect(() =>{
        const handleClick = (event) =>{
            if(taskDetails.current && taskDetails.current == event.target){
                setTaskClicked(false)
            }
        }
        window.addEventListener('click', handleClick)
        return()=>{
            window.removeEventListener('click', handleClick)
        }
    },[])
    
    const statuses = ['Todo', 'Doing', 'Done']
    const [statusClick, setStatusClick] = useState(false)

    return(
    <>
    <ul className="statusList">
        
            {data.columns.map((column) =>(
                <li className="status">
                    <h2>{column.name} (4)</h2>
                    <ul className="tasks">
                        {column.tasks.map((task) =>(
                            <li className="task" onClick={() => openTask(task, column.name)}>
                                <h3 className="title">
                                    {task.title}
                                </h3>
                                <h4 className="subtasksNum">
                                    {task.subtasks.filter(task => task.isCompleted == true).length} of {task.subtasks.length} subtasks
                                </h4>
                                {taskClicked && task.title == currentTask ? 
                                    <div className="taskBackground" ref={taskDetails}>
                                        <div className="taskDetails" >
                                            <div className="taskTitle">
                                                <h3 className="title">{task.title}</h3>
                                                <img src={ellipsis} alt="" />
                                            </div>
                                            {task.description && <p className="taskDescription">
                                                {task.description}
                                            </p>}
                                            {task.subtasks.length > 0 && <div className="taskSubtasks">
                                                <h4 className="subtasksNum">
                                                    Subtasks (
                                                    {task.subtasks.filter(task => task.isCompleted == true).length} of {task.subtasks.length}
                                                    )
                                                </h4>
                                                <ul className="subtasks">
                                                    {task.subtasks.map((subtask) => (
                                                        <label className="subtask">
                                                            <input type="checkbox"
                                                            checked={subtask.isCompleted}
                                                            onChange={() => handleSubtaskClick(column.name, task.title, subtask.title)} />
                                                            <h4 className={subtask.isCompleted ? 'complete' : ''}>{subtask.title}</h4>
                                                        </label>
                                                    ))}
                                                </ul>
                                            </div>}
                                            <div className="taskCurrStatus">
                                                <p>Current Status</p>
                                                <ul className={`statusTask ${statusClick ? 'statusSelect' : ''}`}>
                                                    <div onClick={() => setStatusClick(prevState => !prevState)} className="statusClick">
                                                        <li >{currentStatus}</li>
                                                        <img src={statusClick ? chevronUp : chevronDown} alt="" className="chevron"/>
                                                    </div>
                                                    {statuses.map((status) =>{
                                                        if(status != currentStatus){
                                                            return <li>{status}</li>
                                                        }
                                                    })}
                                                </ul>
                                                
                                            </div>
                                        </div>
                                    </div> : 
                                    ''}
                            </li>
                        ))}
                    </ul>
                </li>
            ))}
           
           
        
    </ul>
    
    </>
    )
}
export default Board