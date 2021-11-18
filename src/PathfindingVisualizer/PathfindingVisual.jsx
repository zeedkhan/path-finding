import React, { useEffect, useState } from 'react'
import Node from './Node/Node'
import {
    getInitialGrid,
    getNewGridWithWallToggled,
    moveStart,
    moveFinish
} from './Grid/grid'
import Nav from './Components/Nav'
import './PathfindingVisualizer.css'
import { useDispatch, useSelector } from 'react-redux'
import { selectSignIn } from '../features/slice/signInModalSlice'
import { getDocs } from '../firebase/firestore'
import { selectUser } from '../features/slice/userSlice'
import { setSpeed } from '../features/slice/speedSlice'
import {
    getAlgorithm,
    getVisualizing,
    getSupportWeight
} from '../features/slice/visualizeSlice'

/* INIT WHEN ANOMYNOUS */
const START_NODE_ROW = 10
const START_NODE_COL = 10
const FINISH_NODE_ROW = 10
const FINISH_NODE_COL = 40
const numRow = 20
const numCol = 50

function PathfindingVisual() {
    const dispatch = useDispatch()

    const [grid, setGrid] = useState([])
    const [weight, setWeight] = useState([])
    const loginModal = useSelector(selectSignIn)

    const playState = useSelector(getVisualizing)
    const currentAlgo = useSelector(getAlgorithm)
    
    const supportWeight = useSelector(getSupportWeight)

    const [mouseIsPressed, setMouseIsPressed] = useState(false)
    const [initPosition, setInitialPosition] = useState({
        startRow: START_NODE_ROW,
        startCol: START_NODE_COL,
        finishRow: FINISH_NODE_ROW,
        finishCol: FINISH_NODE_COL
    })

    const [startNode, setStartNode] = useState(false)
    const [finishNode, setFinishNode] = useState(false)

    const user = useSelector(selectUser)

    /* Range weight */
    useEffect(async () => {
        // new implement should create export function in reuse
        const randomG = () =>
            Math.ceil(Math.random() * Math.max(10, Math.min(1)))

        const grid = getInitialGrid(numRow, numCol, initPosition, randomG)

        // save grid to redux
        if (user) {
            const data = await getDocs()
            setGrid(Object.values(data.grid))
            dispatch(setSpeed(data.speed))
            // find start and finish
            setInitialPosition(data.initPosition)
        } else {
            setWeight(grid.weight)
            setGrid(grid.grid)
        }
        
    }, [user])

    const handleMouseUp = () => {
        setMouseIsPressed(false)
    }

    const handleMouseDown = (row, col) => {
        setMouseIsPressed(true)
        if (grid[row][col].isStart) {
            setFinishNode(false)
            return setStartNode(true)
        } else if (grid[row][col].isFinish) {
            setStartNode(false)
            return setFinishNode(true)
        }

        const newGrid = getNewGridWithWallToggled(grid, row, col, weight)
        // save grid to redux
        setGrid(newGrid)
        setStartNode(false)
        setFinishNode(false)
    }

    const handleMouseEnter = (row, col) => {
        if (!mouseIsPressed) return

        if (startNode) {
            const newGrid = moveStart(grid, row, col)
            setInitialPosition({
                ...initPosition,
                startRow: row,
                startCol: col
            })

            setGrid(newGrid)
        } else if (finishNode) {
            const newGrid = moveFinish(grid, row, col)

            setInitialPosition({
                ...initPosition,
                finishRow: row,
                finishCol: col
            })
            
            setGrid(newGrid)
        } else {
            const newGrid = getNewGridWithWallToggled(grid, row, col, weight)
            setGrid(newGrid)
        }
    }
    return (
        <div>
            <Nav
                numRow={numRow}
                numCol={numCol}
                grid={grid}
                weight={weight}
                setGrid={setGrid}
                initPosition={initPosition}></Nav>

            <div className={`${loginModal && 'filter blur-lg'} flex text-center text-lg justify-center items-center mt-4`}>
                {playState ? (
                    <div>
                        <p>
                            Visualizing&nbsp;
                            <strong className="font-bold italic">{currentAlgo}</strong>
                            &nbsp;is
                            <strong className="font-bold italic">
                                {supportWeight ? ' support' : ' not suport'}
                            </strong>
                            &nbsp;weight
                        </p>
                    </div>
                ) : (
                    'Choose Algorithms for visualizing...'
                )}
            </div>

            <div
                className={`flex flex-row justify-center m-5 mt-6 ${
                    loginModal && 'filter blur-lg'
                }`}>
                <table className="grid matrix-container">
                    {grid.map((row, rowIdx) => {
                        return (
                            <tr key={rowIdx}>
                                {row.map((node, nodeIdx) => {
                                    const {
                                        row,
                                        col,
                                        isFinish,
                                        isStart,
                                        isWall,
                                        isMove,
                                        rangeWeight
                                    } = node
                                    return (
                                        <Node
                                            key={nodeIdx}
                                            rangeWeight={rangeWeight}
                                            col={col}
                                            isFinish={isFinish}
                                            isStart={isStart}
                                            isWall={isWall}
                                            isMove={isMove}
                                            mouseIsPressed={mouseIsPressed}
                                            onMouseDown={(row, col) =>
                                                handleMouseDown(row, col)
                                            }
                                            onMouseEnter={(row, col) =>
                                                handleMouseEnter(row, col)
                                            }
                                            onMouseUp={() => handleMouseUp()}
                                            row={row}></Node>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </table>
            </div>
        </div>
    )
}

export default PathfindingVisual
