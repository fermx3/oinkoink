import { supabase } from "@/src/services/supabase";
import { globalStyles as styles } from "@/src/styles/global-styles";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const moods = [
  { emoji: "😄", description: "Feliz y lleno de energía", mood: "happy" },
  { emoji: "😐", description: "Neutral, tranquilo", mood: "neutral" },
  { emoji: "😢", description: "Triste, necesita cariño", mood: "sad" },
  { emoji: "😡", description: "Enojado, algo le molestó", mood: "angry" },
  { emoji: "🥰", description: "Enamorado y agradecido", mood: "love" },
];

const petEmojis: Record<string, string> = {
  puerquito: "🐷",
  perrito: "🐶",
};

export default function CharacterScreen() {
  const [character, setCharacter] = useState<any>(null);
  const [currentMood, setCurrentMood] = useState(moods[1]); // neutral por defecto
  const [selectedMood, setSelectedMood] = useState(moods[1]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCharacter = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("characters")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!data) {
        router.replace("/create-character");
        return;
      }

      setCharacter(data);

      // Set currentMood and selectedMood to match character.mood
      const moodObj = moods.find((m) => m.mood === data.mood) || moods[1];
      setCurrentMood(moodObj);
      setSelectedMood(moodObj);
      setLoading(false);
    };
    fetchCharacter();
  }, [router]);

  const handleConfirmMood = async () => {
    if (!character) return;
    setUpdating(true);
    await supabase
      .from("characters")
      .update({ mood: selectedMood.mood })
      .eq("id", character.id);
    setCurrentMood(selectedMood);
    setUpdating(false);
  };

  if (loading || !character) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={[styles.container, { flex: 1 }]}>
        {/* Mascota arriba */}
        <View style={{ alignItems: "center", marginBottom: 8 }}>
          <Text style={{ fontSize: 64 }}>
            {petEmojis[character.pet_type] || "🐾"}
          </Text>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
            {character.name}
          </Text>
          {/* Descripción y emoji del mood actual */}
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}
          >
            <Text style={{ fontSize: 22, marginRight: 8 }}>
              {currentMood.emoji}
            </Text>
            <Text style={{ fontSize: 18, color: "#444" }}>
              {currentMood.description}
            </Text>
          </View>
        </View>

        {/* Espacio flexible */}
        <View style={{ flex: 1 }} />

        {/* Selector de mood */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <Text style={{ fontSize: 18, marginBottom: 8 }}>
            Selecciona el estado de ánimo:
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 16 }}
          >
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood.mood}
                onPress={() => setSelectedMood(mood)}
                style={{
                  alignItems: "center",
                  marginHorizontal: 10,
                  padding: 10,
                  borderRadius: 12,
                  borderWidth: selectedMood.mood === mood.mood ? 2 : 1,
                  borderColor:
                    selectedMood.mood === mood.mood ? "#4285F4" : "#ccc",
                  backgroundColor:
                    selectedMood.mood === mood.mood ? "#e3f0ff" : "#fff",
                }}
              >
                <Text style={{ fontSize: 32 }}>{mood.emoji}</Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#444",
                    marginTop: 4,
                    textAlign: "center",
                  }}
                >
                  {mood.description}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Button
            title={updating ? "Actualizando..." : "Cambiar mood"}
            onPress={handleConfirmMood}
            disabled={updating || selectedMood.mood === currentMood.mood}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
