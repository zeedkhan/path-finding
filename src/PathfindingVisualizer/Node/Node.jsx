// import React, { Component } from 'react'

// export default class Node extends Component {

//     // componentDidUpdate(prevPros) {
//     //     // console.log(prevPros);

//     //     if (this.props)

//     // }

//     render() {
//         const {
//             col,
//             row,
//             isFinish,
//             isStart,
//             isWall,
//             isMove,
//             onMouseDown,
//             onMouseEnter,
//             onMouseUp,
//             rangeWeight
//         } = this.props

//         const extraClassName = isFinish
//             ? 'node-finish node-move'
//             : isStart
//             ? 'node-start node-move'
//             : isWall
//             ? 'node-wall '
//             : isMove
//             ? 'node-move '
//             : ''

//         const getRangeWeight = () => {

//             if (rangeWeight != '') return rangeWeight

//             return ''
//         }

//         return (
//             <td
//                 id={`node-${row}-${col}`}
//                 className={`node ${extraClassName}${getRangeWeight()}`}
//                 onMouseDown={() => onMouseDown(row, col)}
//                 onMouseEnter={() => onMouseEnter(row, col)}
//                 onMouseUp={() => onMouseUp()}></td>
//         )
//     }
// }

import React from 'react'
import './Node.css'

function Node({
    col,
    row,
    isFinish,
    isStart,
    isWall,
    isMove,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
    rangeWeight
}) {

    const extraClassName = isFinish
        ? 'node-finish node-move'
        : isStart
        ? 'node-start node-move'
        : isWall
        ? 'node-wall '
        : isMove
        ? 'node-move '
        : ''

    const getRangeWeight = () => {
        if (rangeWeight != '') return rangeWeight

        return ''
    }

    return (
        <td
            id={`node-${row}-${col}`}
            className={`node ${extraClassName}${getRangeWeight()}`}
            onMouseDown={() => onMouseDown(row, col)}
            onMouseEnter={() => onMouseEnter(row, col)}
            onMouseUp={() => onMouseUp()}></td>
    )
}

export default Node
