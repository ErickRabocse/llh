import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="gradient-bg">
      <div className="gradients-container">
        <div className="g1"></div>
      </div>
      <App />
    </div>
  </StrictMode>
)
