import React from "react";
import { View, StyleSheet } from "react-native";
import { AppLayout } from "../src/components";
import TabBar from "../src/components/common/TabBar";
import GalleryScreen from "../src/screens/Gallery/GalleryScreen";

const GalleryPage = () => {
  return (
    <AppLayout>
      <View style={styles.container}>
        <View style={styles.content}>
          <GalleryScreen />
        </View>
        <TabBar active="gallery" />
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default GalleryPage;
