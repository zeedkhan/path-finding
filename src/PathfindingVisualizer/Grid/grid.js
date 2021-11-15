import { addNode, createNode, removeNode } from '../Node/createNode'
import { selectSizeGrid } from '../../features/slice/boardSlice'
import store from '../../store/store'

const clearPrevMove = (grid, type) => {
    const newGrid = grid.slice()

    newGrid.map((vertical) => {
        vertical.map((node) => {
            return (node[type] = false)
        })
    })

    return newGrid
}

export const getInitialGrid = (row, col, initPosition, randomG) => {
    const grid = []
    const weight = []

    const { startRow, startCol, finishRow, finishCol } = initPosition

    for (let r = 0; r < row; r++) {
        const currentRow = []
        const currentRowWeight = []
        for (let c = 0; c < col; c++) {
            currentRow.push(createNode(r, c, initPosition, randomG))

            const startPos = r === startRow && c === startCol
            const finishPos = r === finishRow && c === finishCol

            const testRan = randomG()

            currentRowWeight.push(
                startPos === false && finishPos === false ? testRan : 0
            )

            // create
            currentRow[c].weight.g =
                startPos === false && finishPos === false ? testRan : 0

            if (currentRowWeight[c] > 0) {
                currentRow[c].rangeWeight = `weight-${currentRowWeight[c]}`
            }
        }
        weight.push(currentRowWeight)
        grid.push(currentRow)
    }

    return { grid: grid, weight: weight }
}

export const getNewGridWithWallToggled = (grid, row, col, weight) => {
    const newGrid = grid.slice()
    const node = newGrid[row][col]

    const newNode = {
        ...node,
        isWall: !node.isWall,
        rangeWeight: !node.isWall ? 0 : `weight-${weight[row][col]}`
    }

    newGrid[row][col] = newNode

    return newGrid
}

export const moveStart = (grid, row, col) => {
    if (grid[row][col].isFinish || grid[row][col].isWall) return grid

    const newGrid = clearPrevMove(grid, 'isStart')

    const node = newGrid[row][col]

    const newNode = {
        ...node,
        isStart: !node.isStart
    }

    newGrid[row][col] = newNode

    return newGrid
}

export const moveFinish = (grid, row, col) => {
    if (grid[row][col].isStart || grid[row][col].isWall) return grid

    const newGrid = clearPrevMove(grid, 'isFinish')

    const node = newGrid[row][col]

    const newNode = {
        ...node,
        isFinish: !node.isFinish
    }

    newGrid[row][col] = newNode

    return newGrid
}

export const addDestination = (grid) => {
    const newGrid = grid.slice()
    const { numRow, numCol } = store.getState(selectSizeGrid).board.size

    const randomRow = Math.floor(Math.random() * numRow)
    const randomCol = Math.floor(Math.random() * numCol)

    const newDestinationNode = addNode(randomRow, randomCol)

    newGrid[randomRow][randomCol] = newDestinationNode

    // should return grid
    return newGrid
}

export const removeDestination = (grid, weight) => {
    const newGrid = grid.slice()
    const getAllFinish = []

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            if (grid[row][col].isFinish) {
                getAllFinish.push(grid[row][col])
            }
        }
    }

    if (getAllFinish.length > 1) {
        const randomIsFinish =
            getAllFinish[Math.floor(Math.random() * getAllFinish.length) - 1]
            
        const nodeToRemove = removeNode(randomIsFinish.row, randomIsFinish.col)

        weight[nodeToRemove.row][nodeToRemove.col] = nodeToRemove.weight.g

        newGrid[nodeToRemove.row][nodeToRemove.col] = nodeToRemove
    }

    return newGrid
}
