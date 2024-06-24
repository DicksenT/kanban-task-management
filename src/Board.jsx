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
    return(
    <>
    <ul className="statusList">
        
            {data.columns.map((column) =>(
                <li className="status">
                    <h2>{column.name} (4)</h2>
                    <ul className="tasks">
                        {column.tasks.map((task) =>(
                            <li className="task" onClick={() => setTaskClicked(true)}>
                            <h3 className="title">
                                {task.title}
                            </h3>
                            <h4 className="subtasksNum">
                                0 of {task.subtasks.length} subtasks
                            </h4>
                        </li>
                        ))}
                    </ul>
                </li>
            ))}
           
            
        
    </ul>
    {taskClicked ? 
    <div className="taskBackground">
        <div className="taskDetails">
            test
        </div>
    </div> : 
    ''}
    </>
    )
}
export default Board