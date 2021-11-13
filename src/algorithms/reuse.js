export const notFindExit = (initialPos, algorithm) => {
    const { startNode, grid } = initialPos;


    const sRow = startNode.row;
    const sCol = startNode.col;
    const unvisitedNodes = [[grid[sRow][sCol]]];
    const passNodes = [];
    const visited = new Set();


    while (unvisitedNodes.length) {
        if (algorithm === 'bfs') {
            var [current] = unvisitedNodes.shift();
        } else if (algorithm === 'dfs') {
            var [current] = unvisitedNodes.pop();
        }

        let { row, col, isWall, isFinish } = current;

        if (!visited.has(row + "," + col) && !isWall && !isFinish) {
            visited.add(row + "," + col)

            passNodes.push(grid[row][col])


            if ((row - 1) >= 0 && (row - 1) < grid.length && col >= 0 && col < grid[0].length) {
                unvisitedNodes.push([grid[row - 1][col]])
            }

            if ((row + 1) >= 0 && (row + 1) < grid.length && col >= 0 && col < grid[0].length) {
                unvisitedNodes.push([grid[row + 1][col]])
            }

            if (row >= 0 && row < grid.length && (col - 1) >= 0 && (col - 1) < grid[0].length) {
                unvisitedNodes.push([grid[row][col - 1]])
            }

            if (row >= 0 && row < grid.length && (col + 1) >= 0 && (col + 1) < grid[0].length) {
                unvisitedNodes.push([grid[row][col + 1]])
            }

        }
    }

    return passNodes
}