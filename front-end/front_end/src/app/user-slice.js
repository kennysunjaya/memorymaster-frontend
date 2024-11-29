import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  users: [],
  loading: false,
  error: "",
};

export const usersSlice = createSlice({
  name: "users",

  initialState,

  reducers: {
    fetchPending(state) {
      state.loading = true;
      state.users = [];
      state.error = "";
    },
    fetchSuccess(state, action) {
      state.loading = false;
      state.users = action.payload;
      state.error = "";
    },
    fetchReject(state, action) {
      state.loading = false;
      state.users = [];
      state.error = action.payload;
    },
  },
});

export const { fetchPending, fetchSuccess, fetchReject } = usersSlice.actions;

export const fetchAsync = () => async (dispatch) => {
  try {
    dispatch(fetchPending());

    const { data } = await axios.get("http://localhost:3000/users", {
      headers: {
        Authorization: `Bearer ${localStorage.access_token}`,
      },
    });

    dispatch(fetchSuccess(data.users));
  } catch (error) {
    dispatch(fetchReject(error.message));
  }
};

export default usersSlice.reducer;
