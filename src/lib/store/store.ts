import { configureStore, combineReducers } from "@reduxjs/toolkit";
import todoReducer from "./features/todoSlice";
import authReducer from "./features/authSlice";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { persistReducer, persistStore } from "redux-persist";

// ✅ Config for redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only persist auth slice (skip todo if you don’t want persistence)
};

// ✅ Combine reducers
const rootReducer = combineReducers({
  todo: todoReducer,
  auth: authReducer,
});

// ✅ Wrap with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist uses non-serializable values
    }),
});

// ✅ Persistor for PersistGate
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
