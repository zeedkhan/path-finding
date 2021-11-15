export const createNode = (row, col, initPosition, randomG) => {
    const { startRow, startCol, finishRow, finishCol } = initPosition

    const startPos = row === startRow && col === startCol
    const finishPos = row === finishRow && col === finishCol

    return {
        col,
        row,
        isStart: startPos,
        isFinish: finishPos,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        isMove: false,
        weight: {
            g: 0,
            f: 0,
            h: 0
        },
        rangeWeight: '',
        // weight: {
        //     g: 0,
        //     f: 0,
        //     h: (startPos === false && finishPos === false ? randomG() : 0)
        // },
        previousNode: null
    }
}

export const getNodesPassNodes = (finishNode) => {
    const nodesInShortestPathOrder = []
    let currentNode = finishNode
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode)
        currentNode = currentNode.previousNode
    }
    return nodesInShortestPathOrder
}

export const addNode = (row, col) => {
    // isFinish = true

    return {
        col,
        row,
        isStart: false,
        isFinish: true,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        isMove: false,
        weight: {
            g: 0,
            f: 0,
            h: 0
        },
        rangeWeight: '',
        // weight: {
        //     g: 0,
        //     f: 0,
        //     h: (startPos === false && finishPos === false ? randomG() : 0)
        // },
        previousNode: null
    }
}

export const removeNode = (row, col) => {
    const randomWeight = Math.ceil(Math.random() * Math.max(10, Math.min(1)));
    return {
        col,
        row,
        isStart: false,
        isFinish: false,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        isMove: false,
        weight: {
            g: randomWeight,
            f: 0,
            h: 0
        },
        rangeWeight: `weight-${randomWeight}`,
        // weight: {
        //     g: 0,
        //     f: 0,
        //     h: (startPos === false && finishPos === false ? randomG() : 0)
        // },
        previousNode: null
    }
}
