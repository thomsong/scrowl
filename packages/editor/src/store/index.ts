import { configureStore } from "@reduxjs/toolkit";
import slices from "./slices";
import subscribers from "./slices/subscribers";

export const store = configureStore({
  reducer: slices,
});

subscribers();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
