import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface LectureCardProps {
  title?: string;
  subtitle?: string;
  description?: string;
  dateTime?: string;
  status?: 'active' | 'inactive' | string;
  onPress?: () => void;
}

export default function ViewLecture(props: LectureCardProps) {
  const {
    title = "English Language & Literature",
    subtitle = "Lecture #1",
    description = "test",
    dateTime = "2025-09-07 09:17:01",
    status = "active",
    onPress,
  } = props;
  return (
    <View style={styles.card}>
      {/* Status Badge */}
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{String(status).toUpperCase()}</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {/* Description */}
      <Text style={styles.description}>
        <Text style={{ fontWeight: "bold" }}>{description}</Text>
      </Text>

      {/* Date & Time */}
      <View style={styles.row}>
        <MaterialIcons name="event" size={18} color="red" />
        <Text style={styles.date}> {dateTime}</Text>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Watch Lecture</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    margin: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  statusBadge: {
    position: "absolute",
    right: 12,
    top: 12,
    backgroundColor: "green",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: "#444",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  date: {
    fontSize: 13,
    color: "#555",
  },
  button: {
    backgroundColor: "#4e54c8",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
