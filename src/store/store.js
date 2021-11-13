import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/slice/userSlice";
import speedSlice from "../features/slice/speedSlice";
import visualizeSlice from '../features/slice/visualizeSlice';
import signInModalSlice from "../features/slice/signInModalSlice";
import boardSlice from "../features/slice/boardSlice";

export default configureStore({
  reducer: {
    user: userSlice,
    speed: speedSlice,
    visualizing: visualizeSlice,
    showLoginModal: signInModalSlice,
    board: boardSlice
  }
})
