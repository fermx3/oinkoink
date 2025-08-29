import { supabase } from "@/src/services/supabase";
import { globalStyles as styles } from "@/src/styles/global-styles";
import { useEffect, useState } from "react";
import { Button, SafeAreaView, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const [status, setStatus] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Función para crear usuario si no existe
  const createUserIfNotExists = async (user: any) => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id);

    if (!data || data.length === 0) {
      await supabase.from("users").insert([
        {
          id: user.id,
          username: user.email,
        },
      ]);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      handleSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        handleSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSession = async (session: any) => {
    if (session?.user) {
      setUser(session.user);

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id);

      if (!data || data.length === 0) {
        await createUserIfNotExists(session.user);
      }
    } else {
      setUser(null);
    }
  };

  /* const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  }; */

  const handleEmailLogin = async () => {
    setStatus("Iniciando sesión...");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setStatus(`Error: ${error.message}`);
    } else if (data?.session) {
      setStatus("¡Inicio de sesión exitoso!");
      setUser(data.user);
    } else {
      setStatus("¡Revisa tu correo para confirmar el login!");
    }
  };

  const handleEmailSignUp = async () => {
    setStatus("Registrando...");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setStatus(`Error: ${error.message}`);
    } else if (data?.user) {
      setStatus("¡Registro exitoso!");
      setUser(data.user);
    } else {
      setStatus("¡Revisa tu correo para confirmar el registro!");
    }
  };

  const handleResendConfirmation = async () => {
    setStatus("Reenviando correo de confirmación...");
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setStatus(`Error: ${error.message}`);
    } else {
      setStatus("¡Correo de confirmación reenviado!");
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenido a OinkOink 🐷</Text>
        <Text style={{ marginBottom: 16 }}>{status}</Text>
        {user && <Text style={{ marginBottom: 16 }}>ID: {user.id}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
          <Button title="Iniciar sesión" onPress={handleEmailLogin} />
          <Button title="Registrarse" onPress={handleEmailSignUp} />
        </View>

        {/* Separador visual */}
        {/* <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 16,
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: "#ccc" }} />
          <Text style={{ marginHorizontal: 8, color: "#888" }}>o</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: "#ccc" }} />
        </View>

        <Button
          title="Iniciar sesión con Google"
          color="#4285F4"
          onPress={handleLogin}
        /> */}

        {/* Solo muestra el botón si el usuario NO está autenticado */}
        {!user && (
          <Button
            title="Reenviar correo de confirmación"
            onPress={handleResendConfirmation}
            color="#FFA500"
          />
        )}
      </View>
    </SafeAreaView>
  );
}
