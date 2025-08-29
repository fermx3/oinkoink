import React from "react";
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

type Tab = { key: string; label: string };

type Props = {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  containerStyle?: ViewStyle;
  tabStyle?: ViewStyle;
  activeTabStyle?: ViewStyle;
  textStyle?: TextStyle;
  activeTextStyle?: TextStyle;
};

export default function TabBar({
  tabs,
  activeTab,
  onTabChange,
  containerStyle,
  tabStyle,
  activeTabStyle,
  textStyle,
  activeTextStyle,
}: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
      {tabs.map((t) => {
        const isActive = t.key === activeTab;
        return (
          <TouchableOpacity
            key={t.key}
            onPress={() => onTabChange(t.key)}
            style={[styles.tab, tabStyle, isActive && [styles.activeTab, activeTabStyle]]}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.label, textStyle, isActive && activeTextStyle]}>{t.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", marginVertical: 16 },
  tab: { flex: 1, padding: 12, alignItems: "center", borderBottomWidth: 2, borderBottomColor: "#eee" },
  activeTab: { borderBottomColor: "#007AFF" },
  label: { fontWeight: "bold", color: "#333" },
});
