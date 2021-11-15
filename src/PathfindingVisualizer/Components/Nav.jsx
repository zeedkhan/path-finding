import React, { useEffect, useState } from 'react'
import { visualizeDfs } from '../../algorithms/dfs'
import { visualizeBfs } from '../../algorithms/bfs'
import { algorithmList } from '../../algorithms/list'
import { visualizeDijkstra } from '../../algorithms/dijkstra'
import { visualizeAstar } from '../../algorithms/astar'
import { addDestination, getInitialGrid, removeDestination } from '../Grid/grid'
import { useSelector } from 'react-redux'
import Loader from './utils/Loader'
import { getSpeed, setSpeed } from '../../features/slice/speedSlice'
import {
    getVisualizing,
    setAlgorithm,
    getAlgorithm,
} from '../../features/slice/visualizeSlice'
import { useDispatch } from 'react-redux'
import { updateGridStore } from '../../firebase/firestore'
import {
    AiOutlineLogout,
    AiOutlineMinusCircle,
    AiOutlinePlusCircle
} from 'react-icons/ai'
import { logOut } from '../../firebase/auth'
import { supportWeight } from '../../algorithms/list'

// css
import Login from './member/Login'
import './Nav.css'

// import Modal from './utils/UploadNode'

function Nav({ initPosition, setGrid, numRow, numCol, grid, weight }) {
    // init show weight
    useEffect(() => {
        document.getElementById('weight-toggle').checked = true
    }, [])

    const [showWeight, setShowWeight] = useState(true)
    const currentAlgorithm = useSelector(getAlgorithm)

    useEffect(() => {
        const weightTogger = document.getElementById('weight-toggle')
        if (currentAlgorithm) {
            // handleToggerWeight
            weightTogger.checked = supportWeight(currentAlgorithm)
            if (showWeight != weightTogger.checked) {
                handleToggerWeight()
            }
        }
    }, [currentAlgorithm])

    const dispatch = useDispatch()

    const [isOpenAlgo, setIsOpenAlgo] = useState(false)
    const [isOpenSpeed, setIsOpenSpeed] = useState(false)
    const [isOpenSetting, setIsOpenSetting] = useState(false)
    const [loading, setLoading] = useState(false)
    const speedValue = useSelector(getSpeed)
    const visualizing = useSelector(getVisualizing)

    // unnder develop
    // const [chooseImage, setChooseImage] = useState(false)

    /* Button Setting */
    const toggleAlgo = (isOpen) => () => {
        setIsOpenAlgo(isOpen)
    }

    const toggleSpeed = (isOpen) => () => {
        if (isOpenSetting) {
            setIsOpenSpeed(toggleSetting(!isOpenSetting))
        }
        setIsOpenSpeed(isOpen)
    }

    const toggleSetting = (isOpen) => () => {
        setIsOpenSetting(isOpen)
    }

    const showSpeed = () => {
        if (speedValue <= 20) {
            return 'Fast'
        } else if (speedValue <= 40 && speedValue < 50) {
            return 'Average'
        } else {
            return 'Slow'
        }
    }

    const handleToggerWeight = () => {
        const trigger = document.getElementById('weight-toggle')

        if (currentAlgorithm === 'Depth First Search' && trigger.checked) {
            trigger.checked = false
        } else if (currentAlgorithm !== 'Depth First Search' && !trigger.checked) {
            trigger.checked = true
        } else if (currentAlgorithm === 'A* Search' && trigger.checked) {
            trigger.checked = true
        }  else if (currentAlgorithm === 'A* Search' && !trigger.checked) {
            trigger.checked = false
        } else {
            trigger.checked = !trigger.checked
        }

        grid.map((vertical, row) => {
            vertical.map((node, col) => {
                const currentNode = document.getElementById(
                    `node-${row}-${col}`
                )
                if (trigger.checked) {
                    currentNode.classList.add(`weight-${weight[row][col]}`)
                } else {
                    currentNode.classList.remove(`weight-${weight[row][col]}`)
                }
            })
        })

        setShowWeight(trigger.checked)
    }

    const handleVisual = (algo, grid, initPosition, weight) => {
        dispatch(setAlgorithm(algo))

        switch (algo) {
            case 'Depth First Search':
                visualizeDfs(grid, initPosition)
                break
            case 'Breadth First Search':
                visualizeBfs(grid, initPosition, weight, showWeight)
                break
            case "Dijkstra's":
                visualizeDijkstra(grid, initPosition)
                break
            case 'A* Search':
                visualizeAstar(grid, initPosition, weight)
        }
    }

    const clearBoard = () => {
        // new implement should create export function in reuse
        const randomG = () =>
            Math.ceil(Math.random() * Math.max(10, Math.min(1)))

        const grid = getInitialGrid(numRow, numCol, initPosition, randomG)

        if (!showWeight) {
            document.getElementById('weight-toggle').checked = true
        }

        grid.grid.map((vertical, row) => {
            vertical.map((node, col) => {
                const rangeWeight = grid.weight[row][col].rangeWeight

                const currentNode = document.getElementById(
                    `node-${node.row}-${node.col}`
                )

                currentNode.classList.remove(
                    'node-shortest-path',
                    'node-visited',
                    'node-wall'
                )
                // update weight pros
                weight[row][col] = grid.weight[row][col]

                currentNode.classList.add(rangeWeight)

                if (node.isStart) {
                    currentNode.classList.add('node-start')
                } else if (node.isFinish) {
                    currentNode.classList.add('node-finish')
                }
            })
        })

        setGrid(grid.grid)
    }

    const clearPath = () => {
        const newGrid = grid.slice()

        newGrid.map((vertical, row) => {
            vertical.map((node, col) => {
                // weight come from props
                const rangeWeight = weight[row][col]

                node = {
                    ...node,
                    distance: Infinity,
                    weight: {
                        ...node.weight,
                        h: 0,
                    },
                    isVisited: false,
                    rangeWeight:
                        !node.isStart && !node.isFinish ? rangeWeight : ''
                }

                const currentNode = document.getElementById(
                    `node-${node.row}-${node.col}`
                )

                currentNode.classList.remove(
                    'node-shortest-path',
                    'node-visited'
                )

                if (node.isStart) {
                    currentNode.classList.add('node-start')
                } else if (node.isFinish) {
                    currentNode.classList.add('node-finish')
                } else {
                    currentNode.classList.add(`weight-${rangeWeight}`)
                }
            })
        })
        setGrid(newGrid)
    }

    return (
        <div>
            <nav className="relative z-20 flex flex-row items-center bg-gray-700 text-white h-14">
                <div className="text-xl mr-20 ml-20 w-80">
                    Pathfinding Algorithms
                </div>
                <div className="h-full flex justify-around w-full text-l">
                    <button
                        onClick={toggleAlgo(!isOpenAlgo)}
                        disabled={visualizing}
                        className="block relative h-full w-40 focus:outline-none hover:text-black hover:bg-white pl-2 pr-2">
                        {visualizing && <Loader display="absolute" />}
                        {visualizing ? 'Visualizing' : 'Algorithms'}
                        <div
                            style={{ zIndex: '-1' }}
                            className={`transition transform duration-500 left-0 top-0 absolute ${
                                isOpenAlgo
                                    ? 'translate-y-14'
                                    : '-translate-y-full'
                            }`}>
                            {algorithmList.map((algo) => {
                                return (
                                    <button
                                        key={algo}
                                        onClick={() =>
                                            handleVisual(
                                                algo,
                                                grid,
                                                initPosition,
                                                weight
                                            )
                                        }
                                        className={`text-base w-full bg-gray-700 text-white block px-4 py-2 text-sm hover:text-black ${
                                            isOpenAlgo && 'hover:bg-white'
                                        }`}>
                                        {algo}
                                    </button>
                                )
                            })}
                        </div>
                    </button>
                    <button
                        onClick={() => clearBoard()}
                        disabled={visualizing}
                        className="block h-full overflow-hidden focus:outline-none hover:text-black hover:bg-white pl-2 pr-2">
                        Clear Board
                    </button>
                    <button
                        onClick={() => clearPath()}
                        disabled={visualizing}
                        className="block h-full overflow-hidden focus:outline-none hover:text-black hover:bg-white pl-2 pr-2">
                        Clear Path
                    </button>
                    <button
                        onClick={toggleSpeed(!isOpenSpeed)}
                        disabled={visualizing}
                        className="block h-full w-40 overflow-hidden focus:outline-none hover:text-black hover:bg-white pl-2 pr-2">
                        Speed: {showSpeed()}
                        <div
                            className={
                                isOpenSpeed
                                    ? 'flex justify-center items-center w-40 block absolute mt-5'
                                    : 'hidden'
                            }>
                            <input
                                onChange={(e) => {
                                    dispatch(setSpeed(e.target.value))
                                }}
                                className="slider"
                                type="range"
                                min="10"
                                max="50"
                                step="0.5"
                                value={speedValue}
                            />
                        </div>
                    </button>
                    <div className="flex flex-col justify-center">
                        <div className="ml-4 mr-4 toggle-container relative align-middle select-none transition duration-500 ease-in">
                            <input
                                type="checkbox"
                                name="toggle"
                                id="weight-toggle"
                                onClick={() => handleToggerWeight()}
                                disabled={visualizing}
                                className="pointer-none toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none"
                            />
                            <label
                                for="weight-toggle"
                                onClick={() => handleToggerWeight()}
                                disabled={visualizing}
                                className="pointer-none toggle-label block overflow-hidden h-4 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                        <label
                            for="weight-toggle"
                            onClick={() => handleToggerWeight()}
                            disabled={visualizing}
                            className="cursor-pointer text-xs mt-1 text-white">
                            Using weight
                        </label>
                    </div>
                    <button
                        disabled={visualizing}
                        className="hover:text-black hover:bg-white pl-2 pr-2"
                        onClick={toggleSetting(!isOpenSetting)}>
                        Setting
                    </button>
                    <Login
                        toggle={setIsOpenSetting}
                        isOpen={isOpenSetting}></Login>
                </div>
            </nav>

            <div
                className={`${
                    !isOpenSetting ? 'hidden' : 'block'
                } absolute w-full h-1/2 overflow-hidden top-14`}>
                <div
                    className={`z-10 text-white transition duration-500 h-full w-1/5 right-0 top-0 absolute transform bg-gray-700 bg-opacity-90 ${
                        isOpenSetting
                            ? '-translate-x-50'
                            : 'translate-x-full opacity-0'
                    }`}>
                    <ul className="flex flex-col justify-around w-full items-center h-1/2">
                        <li className="cursor-pointer hover:bg-gray-700 h-10 w-60 rounded-full flex items-center justify-center">
                            {/* should have a modal to set weather start, finish */}
                            <button>
                                <div className="flex flex-row justify-center items-center">
                                    <AiOutlinePlusCircle
                                        onClick={() =>
                                            setGrid(addDestination(grid))
                                        }
                                        className="mr-5 w-7 h-7 hover:bg-white hover:text-black rounded-full"
                                    />
                                    <p>destination</p>
                                    <AiOutlineMinusCircle
                                        onClick={() =>
                                            setGrid(
                                                removeDestination(grid, weight)
                                            )
                                        }
                                        className="ml-5 w-7 h-7 hover:bg-white hover:text-black rounded-full"
                                    />
                                </div>
                            </button>
                        </li>

                        <li className="flex justify-center items-center rounded-full hover:bg-gray-700 w-1/2 h-10 cursor-pointer">
                            <div className="self-center left-0 block flex flex-row">
                                {loading && <Loader display="block" />}
                                <button
                                    disabled={visualizing}
                                    onClick={() => {
                                        setLoading(true)
                                        updateGridStore(
                                            grid,
                                            initPosition
                                        ).then((res) => {
                                            setLoading(false)
                                        })
                                    }}>
                                    Save board
                                </button>
                            </div>
                        </li>
                        <li className="cursor-pointer hover:bg-gray-700 h-10 w-60 rounded-full flex items-center justify-center">
                            {/* should have a modal to set weather start, finish */}
                            <button
                                onClick={() => window.alert('Future feature')}
                                /*onClick={() => setChooseImage(!chooseImage)}*/
                            >
                                Choose Image for node...
                            </button>
                        </li>

                        <div
                            onClick={() => logOut()}
                            className="absolute bottom-5 rounded-full right-0 flex flex-row justify-end items-center text-center w-40 cursor-pointer h-10 hover:bg-gray-700">
                            <div className="mr-5">
                                <p>Log out</p>
                            </div>
                            <div className="mr-5 bg-white rounded-full hover:bg-gray">
                                <AiOutlineLogout className="w-7 h-7 text-black" />
                            </div>
                        </div>
                    </ul>
                </div>
            </div>
            {/* Choose Image for node or custom under develop */}
            {/* {chooseImage && <Modal 
                style={'z-20'}
            />} */}
        </div>
    )
}

export default Nav
