import store from '../store/store';
import { setVisualizing } from '../features/slice/visualizeSlice';

const dijkstra = (grid, startNode, finishNode) => {
    const visitedNodesInOrder = []
    startNode.distance = 0

    const unvisitedNodes = getAllNodes(grid)

    while (!!unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes)
        const closestNode = unvisitedNodes.shift()

        if (closestNode.isWall) continue

        if (closestNode.distance === Infinity) return visitedNodesInOrder
        closestNode.isVisited = true
        visitedNodesInOrder.push(closestNode)
        if (closestNode === finishNode) return visitedNodesInOrder
        updateUnvisitedNeighbors(closestNode, grid)
    }
}

const sortNodesByDistance = (unvisitedNodes) => {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance)
}

const updateUnvisitedNeighbors = (node, grid) => {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid)
    for (const neighbor of unvisitedNeighbors) {
        neighbor.distance = node.distance + 1
        neighbor.previousNode = node
    }
}

const getUnvisitedNeighbors = (node, grid) => {
    const neighbors = []
    const { col, row } = node
    if (row > 0) neighbors.push(grid[row - 1][col])
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col])
    if (col > 0) neighbors.push(grid[row][col - 1])
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1])
    return neighbors.filter((neighbor) => !neighbor.isVisited)
}

const getAllNodes = (grid) => {
    const nodes = []
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node)
        }
    }

    return nodes
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

const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    const speed = store.getState().speed.speed

    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
                animateShortestPath(nodesInShortestPathOrder)
            }, speed * i)

            return
        }
        setTimeout(() => {
            const node = visitedNodesInOrder[i]
            document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-visited'
        }, speed * i)
    }
}

const animateShortestPath = (nodesInShortestPathOrder) => {
    if (nodesInShortestPathOrder.length > 1) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i]
                document.getElementById(
                    `node-${node.row}-${node.col}`
                ).className = 'node node-shortest-path'
            }, 50 * i)
            /*  Set play state in redux to true when reached the last block*/
            if (i === nodesInShortestPathOrder.length - 1) {
                store.dispatch(setVisualizing(false));
            }
        }
    } else {
        // Immediately set play state to true
        store.dispatch(setVisualizing(false));
    }
}

export function visualizeDijkstra(grid, initPosition) {
    const { startRow, startCol, finishRow, finishCol } = initPosition

    const startNode = grid[startRow][startCol]
    const finishNode = grid[finishRow][finishCol]

    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode)
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode)

    /*  Set play state in redux to false */
    store.dispatch(setVisualizing(true));

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder)
}
