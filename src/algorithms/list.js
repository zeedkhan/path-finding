const supportWeightAlgorithms = new Set(['A* Search', 'Breadth First Search'])
const supportBothWeightAndUnWeight = new Set(['Dijkstra', 'Breadth First Search'])

export const algorithmList = [
    'A* Search',
    'Depth First Search',
    'Breadth First Search',
    "Dijkstra's"
]

export const supportWeight = (algorithm) => {
    if (supportWeightAlgorithms.has(algorithm)) return true
    return false
}

export const supportBoth = (algorithm) => {
    if (supportBothWeightAndUnWeight.has(algorithm)) return true
    return false
}