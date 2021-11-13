import React, { useState } from 'react'
import { visualizeDfs } from '../../algorithms/dfs'
import { visualizeBfs } from '../../algorithms/bfs'
import { algorithmList } from '../../algorithms/list'
import { visualizeDijkstra } from '../../algorithms/dijkstra'
import { visualizeAstar } from '../../algorithms/astar'
import { getInitialGrid } from '../Grid/grid'
import { useSelector } from 'react-redux'
import Loader from './utils/Loader'
import { getSpeed, setSpeed } from '../../features/slice/speedSlice'
import { getVisualizing } from '../../features/slice/visualizeSlice'
import { useDispatch } from 'react-redux'
import { updateGridStore } from '../../firebase/firestore'
import { AiOutlineLogout } from 'react-icons/ai'
import { logOut } from '../../firebase/auth'

// css
import Login from './member/Login'
import Modal from './utils/UploadNode'

function Nav({ initPosition, setGrid, numRow, numCol, grid, weight }) {
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

    const handleVisual = (algo, grid, initPosition, weight) => {

        switch (algo) {
            case 'Depth First Search':
                visualizeDfs(grid, initPosition)
                break
            case 'Breadth First Search':
                visualizeBfs(grid, initPosition)
                break
            case "Dijkstra's":
                visualizeDijkstra(grid, initPosition)
                break
            case "A* Search":
                visualizeAstar(grid, initPosition, weight)
        }
    }

    const handleClear = () => {
        const randomG = () => Math.floor(Math.random() * Math.max(100, Math.max(1)));
        const grid = getInitialGrid(numRow, numCol, initPosition, randomG)
        
        grid.grid.map((vertical) => {
            vertical.map((node) => {
                document
                    .getElementById(`node-${node.row}-${node.col}`)
                    .classList.remove(
                        'node-shortest-path',
                        'node-visited',
                        'node-wall'
                    )
                if (node.isStart) {
                    document
                        .getElementById(`node-${node.row}-${node.col}`)
                        .classList.add('node-start')
                } else if (node.isFinish) {
                    document
                        .getElementById(`node-${node.row}-${node.col}`)
                        .classList.add('node-finish')
                }
            })
        })

        setGrid(grid.grid)
    }

    const clearPath = () => {
        const newGrid = grid.slice()
        newGrid.map((vertical) => {
            vertical.map((node) => {
                node.distance = Infinity
                if (node.isVisited) {
                    node.isVisited = !node.isVisited
                }
                document
                    .getElementById(`node-${node.row}-${node.col}`)
                    .classList.remove('node-shortest-path', 'node-visited')
                if (node.isStart) {
                    document
                        .getElementById(`node-${node.row}-${node.col}`)
                        .classList.add('node-start')
                } else if (node.isFinish) {
                    document
                        .getElementById(`node-${node.row}-${node.col}`)
                        .classList.add('node-finish')
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
                        onClick={() => handleClear()}
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

            <div className={`${!isOpenSetting ? 'hidden' : 'block'} absolute w-full h-1/2 overflow-hidden top-14`}>
                <div
                    className={`z-10 text-white transition duration-500 h-full w-1/5 right-0 top-0 absolute transform bg-gray-700 bg-opacity-90 ${
                        isOpenSetting
                            ? '-translate-x-50'
                            : 'translate-x-full opacity-0'
                    }`}>
                    <ul className="flex flex-col justify-around w-full items-center h-1/2">
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
                            <button /*onClick={() => setChooseImage(!chooseImage)}*/
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
