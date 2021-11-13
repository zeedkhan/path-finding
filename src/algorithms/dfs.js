import { getNodesPassNodes } from '../PathfindingVisualizer/Node/createNode'
import { notFindExit } from './reuse'
import store from '../store/store'
import { setVisualizing } from '../features/slice/visualizeSlice'

let initialPos = {}

function dfs(grid, startNode, finishNode) {
    initialPos = { grid: grid, startNode, finishNode }

    const visitedNodesInOrder = []
    const path = []
    const unvisitedNodes = [startNode]

    while (unvisitedNodes.length) {
        const current = unvisitedNodes.pop()

        if (current.isWall) continue

        if (current === finishNode) {
            return visitedNodesInOrder
        }

        if (!current.isVisited) {
            current.isVisited = true

            visitedNodesInOrder.push(current)
            path.push(current)

            const { row, col } = current

            if (row + 1 >= 0 && row + 1 < grid.length)
                unvisitedNodes.push(grid[row + 1][col])
            if (row - 1 >= 0 && row - 1 < grid.length)
                unvisitedNodes.push(grid[row - 1][col])
            if (col + 1 >= 0 && col + 1 < grid[0].length)
                unvisitedNodes.push(grid[row][col + 1])
            if (col - 1 >= 0 && col - 1 < grid[0].length)
                unvisitedNodes.push(grid[row][col - 1])
        }
    }
}

const animateShortestPath = (nodesInShortestPathOrder) => {
    const speed = store.getState().speed.speed

    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        setTimeout(() => {
            const node = nodesInShortestPathOrder[i]
            if (node !== null) {
                document.getElementById(
                    `node-${node.row}-${node.col}`
                ).className = 'node node-shortest-path'
            }
        }, speed * i)

        /*  Set play state in redux to true */
        if (i === nodesInShortestPathOrder.length - 1) {
            store.dispatch(setVisualizing(false));
        }
    }
}

const animate = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    const speed = store.getState().speed.speed

    if (visitedNodesInOrder !== undefined) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {

            /* 
                At exit now
            */

            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    animateShortestPath(nodesInShortestPathOrder)
                }, speed * i)
                return
            }

            /* 
                Find exit

            */

            setTimeout(() => {
                const node = visitedNodesInOrder[i]
                document.getElementById(
                    `node-${node.row}-${node.col}`
                ).className = 'node node-shortest-path'
            }, speed * i)




        }
    } else {

        // Not find exit

        const passNodes = notFindExit(initialPos, 'dfs')
        for (let i = 0; i < passNodes.length; i++) {
            setTimeout(() => {
                const node = passNodes[i]
                document.getElementById(
                    `node-${node.row}-${node.col}`
                ).className = 'node node-shortest-path'
            }, speed * i)
        }
    }
}

export function visualizeDfs(grid, initPosition) {
    const { startRow, startCol, finishRow, finishCol } = initPosition

    const startNode = grid[startRow][startCol]
    const finishNode = grid[finishRow][finishCol]
    const visitedNodesInOrder = dfs(grid, startNode, finishNode)
    const nodesInShortestPathOrder = getNodesPassNodes(finishNode)

    /*  Set play state in redux to false */
    store.dispatch(setVisualizing(true));

    animate(visitedNodesInOrder, nodesInShortestPathOrder)
}