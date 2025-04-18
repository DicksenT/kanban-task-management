import { useContext, useEffect, useState } from "react"
import { authContext } from "../context/AuthContext"
import { kanbanContext } from "../context/KanbanContext"
import useGetData from "../Hooks/UseGetData"

function LoginForm(){
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')
const [type, setType] = useState('login')
const {state, dispatch} = useContext(authContext)
const {dispatch: dataDispatch} = useContext(kanbanContext)
const {fetchData, fetchResult, isSuccess} = useGetData()
const [user, setUser] = useState('')
const handleSubmit = async(e) =>{
    e.preventDefault()
    const enterForm = {email, password}
    try{
        const response = await fetch(`https://kanban-task-management-web-app-86h6.onrender.com/user/${type}`,{
            method:'POST',
            body: JSON.stringify(enterForm),
            headers: {
                'Content-Type' : 'application/json'
            },
            credentials:'include'
        })        
        const json = await response.json()        
        if(response.ok){
            setUser(json)
            await fetchData()
        }
        else{
            setError(json.message)
        }
    }catch(error){
       console.log(error);
    } 
}
useEffect(() =>{
    if(isSuccess){
        dataDispatch({type: 'SET_DATA', payload: fetchResult.boards})
        dispatch({type:'LOGIN', payload:user})
  
    }
},[fetchResult])
    return(
        <div className="loginFormContainer" onSubmit={handleSubmit}>
            <form action="" className="loginContainer">
                <h3>Login</h3>
                <input type="text" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.currentTarget.value)}/>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.currentTarget.value)}/>
                <p className={`loginP ${error && 'loginError'}`}>{error}</p>
                <button className="addSubtaskBtn">
                    {type}
                </button>

                <p className="changeType">
                    {type == 'login' ? 
                    (<>Don't have an account? <span onClick={() => setType('signup')}>Sign Up</span></>) 
                    :
                    (<>Have an account? <span onClick={() => setType('login')}>Login</span></>)
                    }
                </p>
            </form>
        </div>
    )

}

export default LoginForm