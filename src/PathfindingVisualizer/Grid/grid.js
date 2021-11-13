import { createNode } from '../Node/createNode'

const clearPrevMove = (grid, type) => {
    const newGrid = grid.slice()

    newGrid.map((x) => {
        x.map((y) => {
            y[type] = false
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
            currentRowWeight.push((startPos === false && finishPos === false ? randomG() : 0))
        }
        weight.push(currentRowWeight)
        grid.push(currentRow)
    }

    return { grid: grid, weight: weight }
}

export const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice()
    const node = newGrid[row][col]
    const newNode = {
        ...node,
        isWall: !node.isWall
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
