import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import AvailableStores from "../constants/AvailableStores";
import CurrentUserData from "../models/CurrentUserData"
import DrawerState from "../models/DrawerState";
import SearchProductFilter, { SortBy, Store } from "../models/SearchProductFilter";

let initialDrawers: DrawerState = {
  left: '',
  right: ''
};

const drawersSlice = createSlice({
  name: "drawers",
  initialState: {
    drawers: initialDrawers as DrawerState
  },
  reducers: {
    setLeftDrawerState(state, action: PayloadAction<string>) {
      state.drawers.left = action.payload;
    },
    setRightDrawerState(state, action: PayloadAction<string>) {
      state.drawers.right = action.payload;
    }
  }
});

let initialCurrentUserData: CurrentUserData = {
  Id: '',
  username: '',
  passwordHash: '',
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  profileImage: ''
};

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState: {
    currentUser: initialCurrentUserData as CurrentUserData
  },
  reducers: {
    setCurrentUser(state, action: PayloadAction<CurrentUserData>) {
      state.currentUser = action.payload;
    }
  }
});

let searchFilter: SearchProductFilter = {
  keyword: '',
  stores: AvailableStores,
  pageNum: 1,
  sortBy: SortBy.RELEVANCE
};

const searchFilterSlice = createSlice({
  name: "searchFilter",
  initialState: {
    searchFilter: searchFilter
  },
  reducers: {
    setSearchKeyword(state, action: PayloadAction<string>) {
      state.searchFilter.keyword = action.payload;
    },
    setSearchStore(state, action: PayloadAction<Store[]>) {
      state.searchFilter.stores = action.payload;
    },
    setSearchPageNum(state, action: PayloadAction<number>) {
      state.searchFilter.pageNum = action.payload;
    },
    setSearchSortBy(state, action: PayloadAction<SortBy>) {
      state.searchFilter.sortBy = action.payload;
    }
  }
});

export const { setLeftDrawerState, setRightDrawerState } = drawersSlice.actions;
export const { setCurrentUser } = currentUserSlice.actions;
export const { setSearchKeyword, setSearchStore, setSearchPageNum, setSearchSortBy } = searchFilterSlice.actions;
export const drawersSliceReducer = drawersSlice.reducer;
export const currentUserSliceReducer = currentUserSlice.reducer;
export const searchFilterSliceReducer = searchFilterSlice.reducer;