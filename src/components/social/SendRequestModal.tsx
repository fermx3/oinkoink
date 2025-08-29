import React from "react";
import { Button, Modal, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSend: () => void;
  loading: boolean;
  username: string;
  setUsername: (v: string) => void;
};

export default function SendRequestModal({ visible, onClose, onSend, loading, username, setUsername }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Enviar solicitud</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre de usuario"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <View style={styles.buttons}>
            <Button title="Cancelar" onPress={onClose} />
            <Button title="Enviar" onPress={onSend} disabled={!username || loading} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.3)" },
  content: { backgroundColor: "#fff", padding: 24, borderRadius: 8, width: "80%" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 4, padding: 8, marginBottom: 16 },
  buttons: { flexDirection: "row", justifyContent: "space-between" },
});
