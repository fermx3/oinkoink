import { supabase } from "@/src/services/supabase";
import { globalStyles as styles } from "@/src/styles/global-styles";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Button, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

const pets = [
  { type: "puerquito", label: "🐷 Puerquito" },
  { type: "perrito", label: "🐶 Perrito" },
];

export default function CreateCharacterScreen() {
  const [selectedPet, setSelectedPet] = useState("puerquito");
  const [loading, setLoading] = useState(false);
  const [hasCharacter, setHasCharacter] = useState<boolean | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const checkCharacter = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("characters")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setHasCharacter(!!data);
      if (data && data.pet_type) setSelectedPet(data.pet_type);
    };
    checkCharacter();
  }, []);

  const handleCreateOrUpdate = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (hasCharacter) {
      // Actualiza el personaje existente
      await supabase
        .from("characters")
        .update({ pet_type: selectedPet })
        .eq("user_id", user.id);
    } else {
      // Crea un nuevo personaje
      await supabase.from("characters").insert([
        { user_id: user.id, pet_type: selectedPet, mood: "neutral" }
      ]);
    }
    setLoading(false);
    router.replace("/");
  };

  // Determina los textos según si ya tiene personaje
  const titleText = hasCharacter === false ? "Crea tu personaje" : "Elegir personaje";
  const buttonText = hasCharacter === false
    ? loading ? "Creando..." : "Crear personaje"
    : loading ? "Actualizando..." : "Elegir personaje";

  useEffect(() => {
    navigation.setOptions({ title: titleText });
  }, [titleText, navigation]);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>{titleText}</Text>
        <Text style={{ marginBottom: 16 }}>Selecciona tu mascota:</Text>
        <View style={{ flexDirection: "row", marginBottom: 24 }}>
          {pets.map((pet) => (
            <TouchableOpacity
              key={pet.type}
              onPress={() => setSelectedPet(pet.type)}
              style={{
                padding: 12,
                marginHorizontal: 8,
                borderRadius: 8,
                backgroundColor: selectedPet === pet.type ? "#eee" : "#fff",
                borderWidth: selectedPet === pet.type ? 2 : 1,
                borderColor: selectedPet === pet.type ? "#4285F4" : "#ccc",
              }}
            >
              <Text style={{ fontSize: 20 }}>{pet.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button
          title={buttonText}
          onPress={handleCreateOrUpdate}
          disabled={loading}
        />
      </View>
    </SafeAreaView>
  );
}
