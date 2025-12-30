import { Stack } from "expo-router";
import React from "react";
import { Provider } from "react-redux";
import { store } from "../src/redux/store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="admin/index" />
        <Stack.Screen name="gallery" />
      </Stack>
    </Provider>
  );
}
