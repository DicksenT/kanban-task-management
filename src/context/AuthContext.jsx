const { createContext, useReducer, useEffect } = require("react");

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
            return{
                state
            }
    }
}

export const AuthContextProvider = ({childern}) =>{
    const [state, dispatch] = useReducer(authReducer,{
        user: null
    })
    
    useEffect(() =>{
        const checkLogin = async()=>{
            try{
                const loginUser = await fetch('https://kanban-task-management-web-app-86h6.onrender.com/user/loginCheck',{
                    credentials: "include"})
                const json = await loginUser.json()
                dispatch({type:'LOGIN', payload:json})
            }catch{
                try{
                    const token = await fetch('https://kanban-task-management-web-app-86h6.onrender.com/user/refreshToken',
                        {credentials: "include"}
                    )
                    
                    const json = await token.json()
                    dispatch({type:'LOGIN', payload:json})
                }
                catch{
                    console.log('Session Expired, please Login');
                }
            }
        }
        checkLogin()
    },[])   

    return(
    <authContext.Provider value={{...state, dispatch}}>
        {childern}
    </authContext.Provider>
    )
}