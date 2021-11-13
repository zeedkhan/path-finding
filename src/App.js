import './App.css'
import PathfindingVisual from './PathfindingVisualizer/PathfindingVisual'
import { useEffect } from 'react'
import { authChanged } from './firebase/auth'

function App() {

    useEffect(() => {
        authChanged()
    }, [])

    return (
        <div className="App">
            <PathfindingVisual></PathfindingVisual>
        </div>
    )
}

export default App
