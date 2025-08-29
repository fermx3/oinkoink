import { Alert, Button, Text, View } from "react-native";

type FollowUserItemProps = {
  username: string;
  characterName?: string;
  petEmoji?: string;
  moodEmoji?: string;
  moodDescription?: string;
  status: "pending" | "accepted" | "rejected";
  type: "seguido" | "seguidor";
  onAccept?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
  canAccept?: boolean;
  canReject?: boolean;
  canCancel?: boolean;
  canDelete?: boolean;
};

export default function FollowUserItem({
  username,
  characterName,
  petEmoji,
  moodEmoji,
  moodDescription,
  status,
  type,
  onAccept,
  onReject,
  onCancel,
  onDelete,
  canAccept = true,
  canReject = true,
  canCancel = true,
  canDelete = true,
}: FollowUserItemProps) {
  const confirmAction = (action: () => void, message: string) => {
    Alert.alert("Confirmar acción", message, [
      { text: "Cancelar", style: "cancel" },
      { text: "Sí", style: "destructive", onPress: action },
    ]);
  };

  return (
    <View
      style={{
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      {/* Pet icon (if provided) */}
      <View
        style={{ width: 56, alignItems: "center", justifyContent: "center" }}
      >
        <Text style={{ fontSize: 36 }}>{petEmoji || "🐾"}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          {characterName ? `${characterName}` : ""}
        </Text>
        <Text style={{ color: "#888", fontWeight: "normal" }}> {username}</Text>

        {/* Mood shown under title only for "seguido" list (requested) */}
        {type === "seguido" && moodEmoji && moodDescription && (
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}
          >
            <Text style={{ fontSize: 20, marginRight: 8 }}>{moodEmoji}</Text>
            <Text style={{ color: "#444" }}>{moodDescription}</Text>
          </View>
        )}

        {status !== "accepted" && (
          <Text style={{ color: "#888", marginTop: 8 }}>
            {status === "pending" ? "Pendiente" : "Rechazado"}
          </Text>
        )}

        {/* Acciones según tipo y estado */}
        {status === "pending" && type === "seguidor" && (
          <View style={{ flexDirection: "row", marginTop: 8, gap: 8 }}>
            {canAccept && <Button title="Aceptar" onPress={onAccept} />}
            {canReject && (
              <Button
                title="Rechazar"
                color="#d32f2f"
                onPress={() =>
                  confirmAction(
                    onReject || (() => {}),
                    "¿Seguro que quieres rechazar la solicitud?"
                  )
                }
              />
            )}
            {canCancel && (
              <Button
                title="Cancelar"
                color="#888"
                onPress={() =>
                  confirmAction(
                    onCancel || (() => {}),
                    "¿Seguro que quieres cancelar la solicitud?"
                  )
                }
              />
            )}
          </View>
        )}

        {status === "pending" && type === "seguido" && canCancel && (
          <View style={{ marginTop: 8 }}>
            <Button
              title="Cancelar solicitud"
              onPress={() =>
                confirmAction(
                  onCancel || (() => {}),
                  "¿Seguro que quieres cancelar la solicitud?"
                )
              }
            />
          </View>
        )}

        {status === "accepted" && (
          <View style={{ marginTop: 8 }}>
            {type === "seguidor" && canDelete && (
              <Button
                title="Eliminar seguidor"
                color="#d32f2f"
                onPress={() =>
                  confirmAction(
                    onDelete || (() => {}),
                    "¿Seguro que quieres eliminar a este seguidor?"
                  )
                }
              />
            )}
            {type === "seguido" && canDelete && (
              <Button
                title="Dejar de seguir"
                color="#d32f2f"
                onPress={() =>
                  confirmAction(
                    onDelete || (() => {}),
                    "¿Seguro que quieres dejar de seguir?"
                  )
                }
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
}
