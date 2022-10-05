import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";
import PlayerSlice, { actions as PlayerSliceActions } from "./PlayerSlice";

const store = configureStore({
  reducer: PlayerSlice,
  devTools: true,
});

export default store;

type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export const actions = PlayerSliceActions;
