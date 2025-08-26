import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 20, // Cambia aquí el valor según prefieras
    gap: 16,
    backgroundColor: "#fff"
  },
  title: { fontSize: 28, fontWeight: "700" },
  avatar: {
    alignSelf: "center",
    width: 140, height: 140, borderRadius: 80,
    borderWidth: 2, borderColor: "#ddd",
    alignItems: "center", justifyContent: "center"
  },
  emoji: { fontSize: 64 },
  moodDescription: { textAlign: "center", color: "#444", fontSize: 16, marginVertical: 4 },
  hint: { textAlign: "center", color: "#666" },
  card: { padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "#eee", gap: 10 },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  input: {
    borderWidth: 1, borderColor: "#ddd", borderRadius: 12,
    padding: 12
  },
  preview: { color: "#333", fontStyle: "italic", marginTop: 4 }
});
