import { configureStore } from "@reduxjs/toolkit";
import { currentUserSliceReducer, drawersSliceReducer, searchFilterSliceReducer } from "./Reducers";

export const store = configureStore({
    reducer: {
        drawers: drawersSliceReducer,
        currentUser: currentUserSliceReducer,
        searchFilter: searchFilterSliceReducer
    }
});