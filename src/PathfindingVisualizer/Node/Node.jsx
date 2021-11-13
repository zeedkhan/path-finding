import React, { Component } from 'react'
import './Node.css'

export default class Node extends Component {
    render() {
        const {
            col,
            row,
            isFinish,
            isStart,
            isWall,
            isMove,
            onMouseDown,
            onMouseEnter,
            onMouseUp
        } = this.props

        const extraClassName = isFinish
            ? 'node-finish node-move'
            : isStart
            ? 'node-start node-move'
            : isWall
            ? 'node-wall'
            : isMove
            ? 'node-move'
            : ''

        return (
            <td
                id={`node-${row}-${col}`}
                className={`node ${extraClassName}`}
                onMouseDown={() => onMouseDown(row, col)}
                onMouseEnter={() => onMouseEnter(row, col)}
                onMouseUp={() => onMouseUp()}></td>
        )
    }
}
