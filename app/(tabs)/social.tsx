import FollowersList from "@/src/components/social/FollowersList";
import FollowUserItem from "@/src/components/social/FollowUserItem";
import SendRequestModal from "@/src/components/social/SendRequestModal";
import TabBar from "@/src/components/TabBar";
import { supabase } from "@/src/services/supabase";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  View
} from "react-native";

type User = {
  id: string;
  name: string;
  email: string;
  username?: string;
};

type FollowerRow = {
  id: string;
  follower_id: string;
  followed_id: string;
  status: string;
  follower: User;
  followed: User;
  follower_character?: { characters: { name: string } };
  followed_character?: { characters: { name: string,  mood: string, pet_type: string } };
};

const moods = [
  { emoji: "😄", description: "Feliz y lleno de energía", mood: "happy" },
  { emoji: "😐", description: "Neutral, tranquilo", mood: "neutral" },
  { emoji: "😢", description: "Triste, necesita cariño", mood: "sad" },
  { emoji: "😡", description: "Enojado, algo le molestó", mood: "angry" },
  { emoji: "🥰", description: "Enamorado y agradecido", mood: "love" },
];
const petEmojis: Record<string, string> = { puerquito: "🐷", perrito: "🐶" };

export default function ExploreScreen() {
  const [tab, setTab] = useState<"seguidos" | "seguidores">("seguidos");
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [followed, setFollowed] = useState<FollowerRow[]>([]);
  const [followers, setFollowers] = useState<FollowerRow[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);

    // Seguidos: yo soy follower
    const { data: seguidos } = await supabase
      .from("followers")
      .select("*, followed:followed_id(id, username), followed_character:followed_id(characters(name,pet_type,mood))")
      .eq("follower_id", user.id);

    // Seguidores: yo soy followed
    const { data: seguidores } = await supabase
      .from("followers")
      .select("*, follower:follower_id(id, username), follower_character:follower_id(characters(name,pet_type,mood))")
      .eq("followed_id", user.id);

    setFollowed(seguidos || []);
    setFollowers(seguidores || []);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, [showModal]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleSendRequest = async () => {
    setLoading(true);
    const { data: users, error } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .limit(1);

    if (error || !users || users.length === 0) {
      Alert.alert(
        "Usuario no encontrado",
        "No existe un usuario con ese nombre de usuario."
      );
      setLoading(false);
      return;
    }
    const followed_id = users[0].id;

    const { data: existing } = await supabase
      .from("followers")
      .select("id, status")
      .eq("follower_id", userId)
      .eq("followed_id", followed_id)
      .in("status", ["pending", "accepted"]);

    if (existing && existing.length > 0) {
      Alert.alert(
        "Ya existe una solicitud",
        "Ya tienes una solicitud pendiente o ya sigues a este usuario."
      );
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase
      .from("followers")
      .insert([{ follower_id: userId, followed_id, status: "pending" }]);
    if (insertError) {
      Alert.alert("Error", "No se pudo enviar la solicitud.");
    } else {
      Alert.alert(
        "Solicitud enviada",
        "Tu solicitud está pendiente de aprobación."
      );
    }
    setShowModal(false);
    setUsername("");
    setLoading(false);
  };

  const handleAccept = async (row: FollowerRow) => {
    await supabase
      .from("followers")
      .update({ status: "accepted" })
      .eq("id", row.id);
    fetchData();
  };

  const handleReject = async (row: FollowerRow) => {
    await supabase
      .from("followers")
      .update({ status: "rejected" })
      .eq("id", row.id);
    fetchData();
  };

  const handleCancel = async (row: FollowerRow) => {
    await supabase.from("followers").delete().eq("id", row.id);
    fetchData();
  };

  const handleDelete = async (row: FollowerRow) => {
    await supabase.from("followers").delete().eq("id", row.id);
    fetchData();
  };

  // Renderiza cada fila de seguidos usando FollowUserItem
  const renderFollowed = ({ item }: { item: FollowerRow }) => {
    const char = item.followed_character?.characters;
    const petEmoji = petEmojis[char?.pet_type || ""] || "🐾";
    const moodObj = moods.find((m) => m.mood === char?.mood) || moods[1];
    return (
      <FollowUserItem
        username={item.followed?.username || item.followed_id}
        characterName={char?.name}
        petEmoji={petEmoji}
        moodEmoji={moodObj.emoji}
        moodDescription={moodObj.description}
        status={item.status as "pending" | "accepted" | "rejected"}
        type="seguido"
        onCancel={() => handleCancel(item)}
        onDelete={() => handleDelete(item)}
      />
    );
  };

  // Renderiza cada fila de seguidores usando FollowUserItem
  const renderFollowers = ({ item }: { item: FollowerRow }) => (
    <FollowUserItem
      username={item.follower?.username || item.follower_id}
      characterName={item.follower_character?.characters?.name}
      status={item.status as "pending" | "accepted" | "rejected"}
      type="seguidor"
      onAccept={() => handleAccept(item)}
      onReject={() => handleReject(item)}
      onCancel={() => handleCancel(item)}
      onDelete={() => handleDelete(item)}
    />
  );

  return (
    <View style={styles.container}>
      <TabBar
        tabs={[
          { key: "seguidos", label: "Seguidos" },
          { key: "seguidores", label: "Seguidores" },
        ]}
        activeTab={tab}
        onTabChange={(k) => setTab(k as "seguidos" | "seguidores")}
      />

      {/* Botón siempre visible arriba de las listas */}
      {tab === "seguidos" && (
        <View
          style={{
            backgroundColor: "#fff",
            paddingHorizontal: 16,
            marginBottom: 8,
          }}
        >
          <Button title="Enviar solicitud" onPress={() => setShowModal(true)} />
        </View>
      )}

      {tab === "seguidos" ? (
        <View style={styles.listContainer}>
          <FollowersList
            data={followed}
            renderItem={renderFollowed}
            keyExtractor={(item: any) => item.id}
            refreshing={refreshing}
            onRefresh={onRefresh}
            emptyText="No sigues a nadie aún."
          />
        </View>
      ) : (
        <View style={styles.listContainer}>
          <FollowersList
            data={followers}
            renderItem={renderFollowers}
            keyExtractor={(item: any) => item.id}
            refreshing={refreshing}
            onRefresh={onRefresh}
            emptyText="Nadie te sigue aún."
          />
        </View>
      )}

      {/* Modal para enviar solicitud (componente reutilizable) */}
      <SendRequestModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSend={handleSendRequest}
        loading={loading}
        username={username}
        setUsername={setUsername}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, backgroundColor: "#fff" },
  tabBar: { flexDirection: "row", marginVertical: 16 },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#eee",
  },
  activeTab: { borderBottomColor: "#007AFF" },
  tabText: { fontWeight: "bold", color: "#333" },
  listContainer: { flex: 1, padding: 16 },
  emptyText: { textAlign: "center", color: "#888", marginVertical: 20 },
  userItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  email: { color: "#888", fontSize: 12 },
});
