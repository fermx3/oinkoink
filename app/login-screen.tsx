import { supabase } from "@/src/services/supabase";
import { useEffect, useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const [status, setStatus] = useState<string>("Conectando...");
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Función para crear usuario si no existe
  const createUserIfNotExists = async (user: any) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id);

    if (error) {
      setStatus(`Error al consultar usuario: ${error.message}`);
      return;
    }

    if (!data || data.length === 0) {
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: user.id,
          username: user.email,
        },
      ]);
      if (!insertError) {
        setStatus("¡Usuario registrado en la base de datos!");
      } else {
        setStatus(`Error al registrar usuario: ${insertError.message}`);
      }
    }
  };

  useEffect(() => {
    // Obtiene la sesión actual al montar
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      handleSession(session);
    });

    // Escucha cambios en la sesión (login, confirmación, etc)
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

  // Nueva función para manejar la sesión y crear el usuario si es necesario
  const handleSession = async (session: any) => {
    if (session?.user) {
      setUser(session.user);
      setStatus("¡Conexión exitosa! Usuario autenticado.");

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id);

      if (error) {
        setStatus(
          `Conexión OK, pero error al consultar users: ${error.message}`
        );
      } else if (data && data.length > 0) {
        setStatus("¡Conexión y consulta exitosa a users!");
      } else {
        setStatus(
          "Conexión OK, pero no hay registro en users para este usuario."
        );
        await createUserIfNotExists(session.user);
      }
    } else {
      setStatus("Conexión exitosa. No autenticado.");
    }
  };

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 24 }}>
        Bienvenido a OinkOink 🐷
      </Text>
      <Text style={{ marginBottom: 16 }}>{status}</Text>
      {user && <Text style={{ marginBottom: 16 }}>ID: {user.id}</Text>}

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 8,
          width: 220,
          marginBottom: 8,
        }}
        placeholder="Correo electrónico"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 8,
          width: 220,
          marginBottom: 8,
        }}
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
      <View
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

      {/* Botón Google diferenciado */}
      <Button
        title="Iniciar sesión con Google"
        color="#4285F4"
        onPress={handleLogin}
      />

      {/* Solo muestra el botón si el usuario NO está autenticado */}
      {!user && (
        <Button
          title="Reenviar correo de confirmación"
          onPress={handleResendConfirmation}
          color="#FFA500"
        />
      )}
    </View>
  );
}
