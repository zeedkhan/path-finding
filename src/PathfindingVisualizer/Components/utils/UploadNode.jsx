import React from 'react'

import './UploadNode.css'

function Modal({ style }) {
    return (
        <div
            className={`${style} absolute bg-black top-0 modal-height left-0 top-24 w-full bg-opacity-70 flex flex-col justify-center items-center`}>
            <div
                className={`flex flex-col justify-center absolute top-0 ease-in-out transform transition duration-1000 rounded w-full px-8 pt-6 pb-8 mb-4 mt-10 text-white`}>
                <h3 className="text-xl text-center mb-4 font-semibold">
                    Upload image for node...
                </h3>
                <div>
                    <div className="">
                        <input type="checkbox" id="start-node" />
                        <label for="start-node">Start Node</label>
                    </div>

                    <div>
                        <input type="checkbox" id="finish-node" />
                        <label for="finish-node">Finish Node</label>
                    </div>

                    <div>
                        <input type="checkbox" id="visited-node" />
                        <label for="visited-node">Visited Node</label>
                    </div>

                    <div>
                        <input type="color" id="wall-node" />
                        <label for="start-node">Wall Node</label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal
