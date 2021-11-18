import { notFindExit } from './reuse'
import store from '../store/store'
import { setVisualizing } from '../features/slice/visualizeSlice'

let initialPos = {}
const pathNode = []

function astart(grid, startNode, finishNode) {
    // initialPos = { grid: grid, startNode, finishNode }

    const visitedNodesInOrder = []

    startNode.distance = 0

    const destinationSet = new Set()
    let reachDestination = destinationSet.size

    let max = 0;
    let path = null;

    for (let node in finishNode) {
        const { row, col } = finishNode[node]
        destinationSet.add(`${row},${col}`)
    }

    const unvisitedNodes = [startNode]

    // for (let node in finishNode) {
    while (unvisitedNodes.length) {
        const current = unvisitedNodes
            .sort((nodeA, nodeB) => (nodeA.weight.f > nodeB.weight.f ? 1 : -1))
            .shift()

        if (current.weight.f > max) max = current.weight.f

        if (current.isWall) continue

        if (!current.isVisited) {
            current.isVisited = true

            if (destinationSet.has(current.row + ',' + current.col)) {
                reachDestination += 1

                if (reachDestination > 1 && destinationSet.size) {
                    // path = unvisitedNodes.slice();
                    swapHeadAndTail(current);
                }
                    
                if (destinationSet.size == reachDestination) {
                    return visitedNodesInOrder
                }
                continue
            }


            visitedNodesInOrder.push(current)
            const { row, col } = current

            // const nodeToMove = [{row: row+1, col: col}, {row: row-1, col: col}, {row: row, col: col +1}, {row: row, col: col - 1}];

            if (row + 1 >= 0 && row + 1 < grid.length) {
                updateNeighbors(
                    current,
                    grid,
                    row + 1,
                    col,
                    unvisitedNodes,
                )
            }

            if (row - 1 >= 0 && row - 1 < grid.length) {
                updateNeighbors(
                    current,
                    grid,
                    row - 1,
                    col,
                    unvisitedNodes,
                )
            }

            if (col + 1 >= 0 && col + 1 < grid[0].length) {
                updateNeighbors(
                    current,
                    grid,
                    row,
                    col + 1,
                    unvisitedNodes,
                )
            }

            if (col - 1 >= 0 && col - 1 < grid[0].length) {
                updateNeighbors(
                    current,
                    grid,
                    row,
                    col - 1,
                    unvisitedNodes,
                )
            }
        }
    }
}

const swapHeadAndTail = (head, unvisitedNodes) => {
    let current = head;
    let prev = null;
    let next = null;

    while (current !== null) {
        // get child node
        next = current.previousNode;
        
        current.previousNode = prev;
        prev = current
        // current = prev;
        
        
        current = next;
        // current = next;
    }
}

const updateNeighbors = (current, grid, row, col, unvisitedNodes) => {
    const nextNode = grid[row][col]

    nextNode.weight.f += current.weight.h + current.weight.g
    
    if (!nextNode.isVisited) {
        if (nextNode.isFinish) {
            nextNode.weight.f = -Infinity
        }

        nextNode.previousNode = current
        unvisitedNodes.unshift(nextNode)
        pathNode.push(nextNode)
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

    console.log('astar shortest move', nodesInShortestPathOrder);

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

    const sameList = new Set()

    let currentNode = finishNode

    for (let node in finishNode) {
        currentNode = finishNode[node]

        while (currentNode !== null) {
            if (sameList.has(currentNode.row + ',' + currentNode.col)) {
                break;
            }
            sameList.add(currentNode.row + ',' + currentNode.col)

            if (node > 0) {
                nodesInShortestPathOrder.unshift(currentNode)
            } else {
                nodesInShortestPathOrder.unshift(currentNode)
            }

            currentNode = currentNode.previousNode
        }
    }
    return nodesInShortestPathOrder
}

export function visualizeAstar(grid, initPosition, weight) {
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
    const finishNode = grid[finishRow][finishCol]

    const visitedNodesInOrder = astart(grid, startNode, findFinish, weight);

    // const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode)
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(findFinish)

    /*  Set play state in redux to false*/
    // store.dispatch(setVisualizing(true))
    animate(visitedNodesInOrder, nodesInShortestPathOrder)



    // buildGraph(nodesInShortestPathOrder)
}

const buildGraph = (grid) => {
    console.log(grid)

    const maxRow = Math.max(...grid.map((i) => i.row))
    const maxCol = Math.max(...grid.map((i) => i.col))

    const store = Array(maxRow + 1)
        .fill()
        .map((x) => Array(maxCol + 1))

    grid.map((node) => {
        if (node.isFinish) {
            store[node.row][node.col] = 'F'
        } else if (node.isStart) {
            store[node.row][node.col] = 'S'
        } else {
            store[node.row][node.col] = node.weight.f
        }
    })

    store.map((list) => list.filter((item) => Number(item)))

    console.log(convertToAdjList(store))
}

function convertToAdjList(adjMatrix) {
    // console.log(adjMatrix);

    console.log(adjMatrix)
    return adjMatrix.map((a, k) => a.map((v, i) => v))
}
