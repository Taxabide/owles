import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ViewLecture from "../../../src/components/admin/AdminViewLecture";
import { fetchLecturesByCourse } from "../../../src/redux/slices/viewLectureSlice";
import { AppDispatch, RootState } from "../../../src/redux/store";

export default function AdminViewLectureScreen() {
  const params = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const courseName = typeof params.courseName === "string" ? params.courseName : "";
  const courseId = typeof params.courseId === "string" ? params.courseId : "";
  const { lectures, listLoading, listError } = useSelector((state: RootState) => state.viewLecture);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchLecturesByCourse(courseId));
    }
  }, [dispatch, courseId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: true, title: courseName ? `${courseName} • Lectures` : "Lectures" }} />
      <ScrollView contentContainerStyle={styles.container}>
        {courseName ? (
          <Text style={styles.heading}>{courseName}</Text>
        ) : null}

        {listLoading ? (
          <ActivityIndicator size="large" color="#1976D2" style={{ marginTop: 24 }} />
        ) : listError ? (
          <Text style={styles.error}>Error: {listError}</Text>
        ) : lectures.length === 0 ? (
          <Text style={styles.empty}>Not available any lecture.</Text>
        ) : (
          <View style={{ paddingBottom: 24 }}>
            {lectures.map((lec: any, idx: number) => (
              <ViewLecture
                key={(lec.l_id as any) ?? (lec.id as any) ?? idx}
                title={lec.title || lec.name || courseName}
                subtitle={lec.lecture_no ? `Lecture #${lec.lecture_no}` : undefined}
                description={lec.l_course_description || lec.description}
                dateTime={lec.l_created_at || lec.created_at}
                status={(lec.l_course_status as any) || (lec.status as any) || 'active'}
                onPress={() => {
                  const link = lec.l_course_link || lec.link;
                  if (link) {
                    // open external link
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    require('expo-linking').openURL(link);
                  }
                }}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  container: {
    paddingVertical: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  error: {
    color: '#DC2626',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  empty: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
  },
});


