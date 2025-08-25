import { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const moods = [
  { emoji: "😄", description: "Feliz y lleno de energía" },
  { emoji: "😐", description: "Neutral, tranquilo" },
  { emoji: "😢", description: "Triste, necesita cariño" },
  { emoji: "😡", description: "Enojado, algo le molestó" },
  { emoji: "🥰", description: "Enamorado y agradecido" },
];

export default function App() {
  const [moodIndex, setMoodIndex] = useState(0);
  const [message, setMessage] = useState("");

  const cycleMood = () => {
    setMoodIndex((moodIndex + 1) % moods.length);
  };

  const currentMood = moods[moodIndex];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tu Personaje</Text>

      <TouchableOpacity onPress={cycleMood} style={styles.avatar}>
        <Text style={styles.emoji}>{currentMood.emoji}</Text>
      </TouchableOpacity>
      <Text style={styles.moodDescription}>{currentMood.description}</Text>
      <Text style={styles.hint}>Toca el emoji para cambiar el estado de ánimo</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ponle palabras a tu personaje</Text>
        <TextInput
          style={styles.input}
          placeholder="¿Qué diría hoy tu personaje?"
          value={message}
          onChangeText={setMessage}
        />
        <Text style={styles.preview}>
          {message ? `"${message}"` : "Aquí verás lo que tu personaje 'dice'."}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16, backgroundColor: "#fff" },
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
