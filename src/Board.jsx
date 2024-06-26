import { useEffect, useState } from "react"

function Board(props){
    const {data} = props
    const [taskClicked, setTaskClicked] = useState(false)
    useEffect(() =>{
        const handleClick = (event) =>{
            console.log(event.target);
        }
        window.addEventListener('click', handleClick)
        return(
            window.removeEventListener('click', handleClick)
        )
    },[])

    const [currentTask, setCurrentTask] = useState()
    const openTask = (title) =>{
        setTaskClicked(true)
        setCurrentTask(title)
    }
    return(
    <>
    <ul className="statusList">
        
            {data.columns.map((column) =>(
                <li className="status">
                    <h2>{column.name} (4)</h2>
                    <ul className="tasks">
                        {column.tasks.map((task) =>(
                            <li className="task" onClick={() => openTask(task.title)}>
                                <h3 className="title">
                                    {task.title}
                                </h3>
                                <h4 className="subtasksNum">
                                    {task.subtasks.filter(task => task.isCompleted == true).length} of {task.subtasks.length} subtasks
                                </h4>
                                {taskClicked && task.title == currentTask ? 
                                    <div className="taskBackground">
                                        <div className="taskDetails">
                                            {task.title}
                                            {console.log(task.title)}
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