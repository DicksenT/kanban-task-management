import { useContext } from "react"
import { kanbanContext } from "../context/KanbanContext"
import { Link } from "react-router-dom"

function Dashboard(props){
    const {setEditBoard, setType} = props
    const {state, dispatch} = useContext(kanbanContext)
    
    const handleCreateBoard = () =>{
        setType('create')
        setEditBoard(true)
    }

    return(
        <section className={`dashboardContainer ${state.darkMode && 'darkStatus'}`}>
            <h2>Dashboard</h2>
            <ul className="dashboardLists">
                {state.boards && state.boards.map((board) =>(
                    <Link to={`/${board.name}`}>
                    <li className={`dashboardList `}>
                        <h4>{board.name}</h4>
                        <p>{board.totalTask} Tasks</p>
                    </li>
                    </Link>
                ))}
                <li className="dashboardCreate"onClick={handleCreateBoard}>Create New Board</li>
            </ul>
        </section>
    )
}
export default Dashboard