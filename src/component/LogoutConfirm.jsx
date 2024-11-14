import { useContext } from "react"
import { kanbanContext } from "../context/KanbanContext"
import { authContext } from "../context/AuthContext"

const LogoutConfirm = (props) => {
    const {state, dispatch: kanbanDispatch} = useContext(kanbanContext)
    const {dispatch} = useContext(authContext)
    const {setConfirm} = props
    const logout = async() =>{
        try{
            const response = await fetch('https://kanban-task-management-web-app-86h6.onrender.com/userAuth/logout',{
                credentials:'include',
                method:'DELETE'
            })
            if(response.ok){
                console.log(state);
                kanbanDispatch({type:"LOGOUT"})
                dispatch({type:"LOGOUT"})
            }
            else{
                throw new Error('Failed to logout')
            }
        }catch{
            try{
                const refresh = await fetch('https://kanban-task-management-web-app-86h6.onrender.com/user/refreshToken',
                    {credentials:'include'}
                )
                if(refresh.ok){
                    const respomnse = await fetch('https://kanban-task-management-web-app-86h6.onrender.com/userAuth/logout',{
                        credentials:'include',
                        method:'DELETE'
                    })
                    if(respomnse.ok){
                        dispatch({type:"LOGOUT"})
                    }   
                    else{
                        throw new Error('Failed to logout')
                    }             
                }
            }catch(error){
                console.log(error)
            }
        }
    }
    return(
        <div className="taskBackground">
        <div className={`confirmation taskDetails ${state.darkMode && 'dark'}`}>
            <p className="red">Are you sure want to Logout?, you need to login again later</p>
            <div className="buttonChoice">
                <button className="confirm" onClick={logout}>Logout</button>
                <button className="cancel" onClick={() => setConfirm(false)}>Cancel</button>
            </div>
        </div>
    </div>
    )
}

export default LogoutConfirm