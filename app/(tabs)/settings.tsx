import { supabase } from "@/src/services/supabase";
import { globalStyles as styles } from "@/src/styles/global-styles";
import { useRouter } from "expo-router";
import { Button, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleChangePet = () => {
    router.push("/create-character");
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={[styles.container, { flex: 1 }]}>
        {/* Título y menú superior */}
        <View style={{ marginBottom: 32 }}>
          <Text style={styles.title}>Ajustes</Text>
          <View style={{ flexDirection: "row", marginTop: 16 }}>
            <TouchableOpacity
              onPress={handleChangePet}
              style={{
                backgroundColor: "#4285F4",
                paddingVertical: 10,
                paddingHorizontal: 18,
                borderRadius: 8,
                marginRight: 12,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                Cambiar mascota
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Espacio flexible para empujar el botón hacia abajo */}
        <View style={{ flex: 1 }} />

        {/* Botón de cerrar sesión abajo en rojo */}
        <View style={{ marginBottom: 24 }}>
          <Button
            title="Cerrar sesión"
            color="#d32f2f"
            onPress={handleLogout}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
