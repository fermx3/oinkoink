import React from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, TextStyle, ViewStyle } from "react-native";

type Props = {
  text: string;
  refreshing: boolean;
  onRefresh: () => void;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
};

export default function EmptyListWithRefresh({
  text,
  refreshing,
  onRefresh,
  containerStyle,
  textStyle,
}: Props) {
  return (
    <ScrollView
      contentContainerStyle={[styles.container, containerStyle]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16 },
  text: { textAlign: "center", color: "#888", fontSize: 16 },
});
