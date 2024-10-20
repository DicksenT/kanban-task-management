import { useState } from "react"

function LoginForm(){
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')
const [type, setType] = useState('login')

const handleSubmit = async(e) =>{
    e.preventDefault()
    const enterForm = {email, password}

    try{
    const response = await fetch(`https://kanban-task-management-web-app-86h6.onrender.com/${type}`,{
        method:'POST',
        body: json.stringify(enterForm)
    })
    const json = await response.json()
    if(response.ok){
        
    }
    }catch(error){
        console.log(error);
    }
}
    return(
        <div className="formContainer" onSubmit={handleSubmit}>
            <form action="" className="loginContainer">
                <h3>Login</h3>
                <input type="text" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.currentTarget.value)}/>
                <input type="text" placeholder="Password" value={password} onChange={(e) => setPassword(e.currentTarget.value)}/>

                <button>
                    {type.capitalize()}
                </button>

                <p className="changeType">
                    {type == 'login' ? 
                    `Don't have an account? ${<span onClick={() => setType('signup')}>{type}</span>}` 
                    :
                    `Have an account? ${<span onClick={() => setType('login')}>{type}</span>}`
                    }
                    
                    </p>
            </form>
            <div className="errorMsg">
                {error}
            </div>
        </div>
    )

}

export default LoginForm