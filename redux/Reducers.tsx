import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import CurrentUserData from "../models/CurrentUserData"

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
      state.currentUser = action.payload
    }
  }
})

export const { setCurrentUser } = currentUserSlice.actions
export default currentUserSlice.reducer