import { notFindExit } from './reuse'
import store from '../store/store'
import {
    setVisualizing
} from '../features/slice/visualizeSlice'

let initialPos = {}

function bfs(grid, startNode, finishNode, weight, isWeight) {
    initialPos = { grid: grid, startNode, finishNode }

    const isWeightNow = isWeight

    console.log(isWeightNow)

    const visitedNodesInOrder = []
    const path = []
    startNode.distance = 0

    let reachDestination = 0

    const unvisitedNodes = [startNode]

    const destinationSet = new Set()

    for (let node in finishNode) {
        const { row, col } = finishNode[node]
        destinationSet.add(`${row},${col}`)
    }

    for (let node in finishNode) {
        while (unvisitedNodes.length) {
            if (isWeightNow) {
                const current = unvisitedNodes
                    .sort((nodeA, nodeB) => nodeA.weight.g - nodeB.weight.g)
                    .shift()

                if (current.isWall) continue

                if (!current.isVisited) {
                    current.isVisited = true
                    visitedNodesInOrder.push(current)

                    if (destinationSet.has(current.row + ',' + current.col)) {
                        reachDestination += 1
                        continue
                    }

                    if (destinationSet.size == reachDestination) {
                        return visitedNodesInOrder
                    }

                    path.push(current)

                    const { row, col } = current

                    if (row + 1 >= 0 && row + 1 < grid.length) {
                        const nextNode = grid[row + 1][col]
                        nextNode.distance = current.distance + 1

                        if (!nextNode.isVisited) {
                            nextNode.previousNode = current
                        }

                        unvisitedNodes.push(nextNode)
                    }

                    if (row - 1 >= 0 && row - 1 < grid.length) {
                        const nextNode = grid[row - 1][col]
                        nextNode.distance = current.distance + 1

                        if (!nextNode.isVisited) {
                            nextNode.previousNode = current
                        }
                        unvisitedNodes.push(nextNode)
                    }

                    if (col + 1 >= 0 && col + 1 < grid[0].length) {
                        const nextNode = grid[row][col + 1]
                        nextNode.distance = current.distance + 1

                        if (!nextNode.isVisited) {
                            nextNode.previousNode = current
                        }
                        unvisitedNodes.push(nextNode)
                    }

                    if (col - 1 >= 0 && col - 1 < grid[0].length) {
                        const nextNode = grid[row][col - 1]
                        nextNode.distance = current.distance + 1

                        if (!nextNode.isVisited) {
                            nextNode.previousNode = current
                        }
                        unvisitedNodes.push(nextNode)
                    }
                }
            } else {
                const current = unvisitedNodes.shift()

                if (current.isWall) continue

                if (!current.isVisited) {
                    current.isVisited = true
                    visitedNodesInOrder.push(current)

                    if (destinationSet.has(current.row + ',' + current.col)) {
                        reachDestination += 1
                        continue
                    }

                    if (destinationSet.size == reachDestination) {
                        return visitedNodesInOrder
                    }

                    path.push(current)

                    const { row, col } = current

                    if (row + 1 >= 0 && row + 1 < grid.length) {
                        const nextNode = grid[row + 1][col]
                        nextNode.distance = current.distance + 1

                        if (!nextNode.isVisited) {
                            nextNode.previousNode = current
                        }

                        unvisitedNodes.push(nextNode)
                    }

                    if (row - 1 >= 0 && row - 1 < grid.length) {
                        const nextNode = grid[row - 1][col]
                        nextNode.distance = current.distance + 1

                        if (!nextNode.isVisited) {
                            nextNode.previousNode = current
                        }
                        unvisitedNodes.push(nextNode)
                    }

                    if (col + 1 >= 0 && col + 1 < grid[0].length) {
                        const nextNode = grid[row][col + 1]
                        nextNode.distance = current.distance + 1

                        if (!nextNode.isVisited) {
                            nextNode.previousNode = current
                        }
                        unvisitedNodes.push(nextNode)
                    }

                    if (col - 1 >= 0 && col - 1 < grid[0].length) {
                        const nextNode = grid[row][col - 1]
                        nextNode.distance = current.distance + 1

                        if (!nextNode.isVisited) {
                            nextNode.previousNode = current
                        }
                        unvisitedNodes.push(nextNode)
                    }
                }
            }
        }
    }
}

const animate = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    const speed = store.getState().speed.speed

    if (visitedNodesInOrder !== undefined) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    animateShortestPath(nodesInShortestPathOrder)
                }, speed * i)
                return
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i]
                document.getElementById(
                    `node-${node.row}-${node.col}`
                ).className = 'node node-visited'
            }, speed * i)
        }
    } else {
        const passNodes = notFindExit(initialPos, 'bfs')
        for (let i = 0; i < passNodes.length; i++) {
            setTimeout(() => {
                const node = passNodes[i]
                document.getElementById(
                    `node-${node.row}-${node.col}`
                ).className = 'node node-visited'

                /*  Set play state in redux to true */
                if (i === passNodes.length - 1) {
                    store.dispatch(setVisualizing(false))
                }
            }, speed * i)
        }
    }
}

const animateShortestPath = (nodesInShortestPathOrder) => {

    console.log('bfs shorstest move', nodesInShortestPathOrder.length);

    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        setTimeout(() => {
            const node = nodesInShortestPathOrder[i]
            if (node !== null) {
                document.getElementById(
                    `node-${node.row}-${node.col}`
                ).className = 'node node-shortest-path'
            }
        }, 50 * i)

        /*  Set play state in redux to true */
        if (i === nodesInShortestPathOrder.length - 1) {
            store.dispatch(setVisualizing(false))
        }
    }
}

const getNodesInShortestPathOrder = (finishNode) => {
    const nodesInShortestPathOrder = []
    let currentNode = finishNode

    for (let node in finishNode) {
        currentNode = finishNode[node]
        while (currentNode !== null) {
            nodesInShortestPathOrder.unshift(currentNode)
            currentNode = currentNode.previousNode
        }
    }

    return nodesInShortestPathOrder
}

export function visualizeBfs(grid, initPosition, weight, isWeight) {
    const { startRow, startCol, finishRow, finishCol } = initPosition

    const findFinish = []

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col].isFinish === true) {
                findFinish.push(grid[row][col])
            }
        }
    }

    const startNode = grid[startRow][startCol]
    // const finishNode = grid[finishRow][finishCol]

    const visitedNodesInOrder = bfs(
        grid,
        startNode,
        findFinish,
        weight,
        isWeight
    )
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(findFinish)

    /*  Set play state in redux to false*/
    store.dispatch(setVisualizing(true))

    animate(visitedNodesInOrder, nodesInShortestPathOrder)
}
