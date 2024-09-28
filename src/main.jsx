import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { KanbanContextProvider } from './context/KanbanContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <KanbanContextProvider>
    <App />
    </KanbanContextProvider>

  </React.StrictMode>,
)
