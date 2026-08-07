import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to MediAI</h1>
      <p>Hospital Management System</p>
      
      <button 
        onClick={() => setCount((count) => count + 1)}
        style={{ padding: '10px 20px', fontSize: '16px', marginTop: '20px', cursor: 'pointer' }}
      >
        Click test: {count}
      </button>
    </div>
  )
}

export default App
