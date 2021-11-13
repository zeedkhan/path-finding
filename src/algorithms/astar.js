import { notFindExit } from './reuse'
import store from '../store/store'
import { setVisualizing } from '../features/slice/visualizeSlice'

let initialPos = {}

function astart(grid, startNode, finishNode, weight) {
    initialPos = { grid: grid, startNode, finishNode }

    const visitedNodesInOrder = []
    const path = []
    startNode.distance = 0
        
    const unvisitedNodes = [startNode]

    while (unvisitedNodes.length) {
        const current = unvisitedNodes.sort((nodeA, nodeB) => nodeA.weight.f - nodeB.weight.f).shift();

        if (current.isWall) continue

        if (current === finishNode) {
            console.log('finsihed', current)
            return visitedNodesInOrder
        }

        if (!current.isVisited) {
            current.isVisited = true
            visitedNodesInOrder.push(current)
            path.push(current)

            const { row, col } = current

            if (row + 1 >= 0 && row + 1 < grid.length) {
                const nextNode = grid[row + 1][col]
                
                nextNode.weight.f = weight[row][col] + current.weight.f
                // nextNode.distance = current.distance + 1

                if (!nextNode.isVisited) {
                    nextNode.previousNode = current
                }

                unvisitedNodes.push(nextNode)
            }

            if (row - 1 >= 0 && row - 1 < grid.length) {
                const nextNode = grid[row - 1][col]
                // nextNode.distance = current.distance + 1

                nextNode.weight.f = weight[row][col] + current.weight.f

                if (!nextNode.isVisited) {
                    nextNode.previousNode = current
                }
                unvisitedNodes.push(nextNode)
            }

            if (col + 1 >= 0 && col + 1 < grid[0].length) {
                const nextNode = grid[row][col + 1]
                // nextNode.distance = current.distance + 1
                
                nextNode.weight.f = weight[row][col] + current.weight.f

                if (!nextNode.isVisited) {
                    nextNode.previousNode = current
                }
                unvisitedNodes.push(nextNode)
            }

            if (col - 1 >= 0 && col - 1 < grid[0].length) {
                const nextNode = grid[row][col - 1]
                // nextNode.distance = current.distance + 1

                nextNode.weight.f = weight[row][col] + current.weight.f

                if (!nextNode.isVisited) {
                    nextNode.previousNode = current
                }
                unvisitedNodes.push(nextNode)
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
        const passNodes = notFindExit(initialPos, 'astar')
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
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode)
        currentNode = currentNode.previousNode
    }

    return nodesInShortestPathOrder
}

export function visualizeAstar(grid, initPosition, weight) {
    
    const { startRow, startCol, finishRow, finishCol } = initPosition

    const startNode = grid[startRow][startCol]
    const finishNode = grid[finishRow][finishCol]

    const visitedNodesInOrder = astart(grid, startNode, finishNode, weight)
    console.log(finishNode)
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode)

    /*  Set play state in redux to false*/
    store.dispatch(setVisualizing(true))

    animate(visitedNodesInOrder, nodesInShortestPathOrder)
}
