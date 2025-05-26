import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {getLLMResponse} from '../api/gemini'

function App() {
  const [count, setCount] = useState(0)
  const [response, setResponse] = useState('');
  const [typing , setTyping] = useState('')
  useEffect(() => {
    const bootstrap = async () => {
      setResponse(await getLLMResponse('오픈소스에 대해 알려줘'))
      setTyping(await getLLMResponse("타이핑 할 문장 알려줘"))
    }
    bootstrap();
    
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>{typing}</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          {response}
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
