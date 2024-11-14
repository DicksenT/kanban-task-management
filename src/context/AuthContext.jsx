import { createContext, useReducer, useEffect} from "react";

export const authContext = createContext()

const authReducer = (state, action) =>{
    switch(action.type){
        case 'LOGIN':
            return{
                user: action.payload
            }
        case 'LOGOUT':
            return{
                user: null
            }
        default:
            return state
        }
}

export const AuthContextProvider = ({children}) =>{
    const [state, dispatch] = useReducer(authReducer,{
        user: null
    })
    
    useEffect(() =>{
        const checkLogin = async()=>{
            try{
                const loginUser = await fetch('https://kanban-task-management-web-app-86h6.onrender.com/userAuth/loginCheck',{
                    credentials: "include"})
                const json = await loginUser.json()
                if(loginUser.ok){
                    dispatch({type:'LOGIN', payload:json})
                }
                else{
                    throw new Error('Token Expired')
                }
                
            }catch{
                try{
                    const token = await fetch('https://kanban-task-management-web-app-86h6.onrender.com/user/refreshToken',
                        {credentials: "include"}
                    )
                    if(token.ok){
                        const response = await fetch('https://kanban-task-management-web-app-86h6.onrender.com/userAuth/loginCheck',{
                            credentials: "include"})
                        const json = await response.json()
                        if(response.ok){
                            dispatch({type:'LOGIN', payload:json})
                        }
                        else{
                            throw new Error('Token Expired')
                        }
                    }
                    else{
                        throw new Error('Refresh Token Failed')
                    }
                }
                catch(error){
                    console.log(error);
                }
            }
        }
        checkLogin()
    },[])   

    return(
    <authContext.Provider value={{state, dispatch}}>
        {children}
    </authContext.Provider>
    )
}