import { supabase } from "@/src/services/supabase";
import type { Session } from "@supabase/supabase-js";
import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import LoginScreen from "../login-screen";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function Layout() {
  const colorScheme = useColorScheme();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Obtiene la sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    // Escucha cambios en la sesión
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!session) {
    return <LoginScreen />;
  }

  return (
    <Tabs
      screenOptions={{
      tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      headerShown: false,
      tabBarButton: HapticTab,
      tabBarBackground: TabBarBackground,
      tabBarStyle: Platform.select({
        ios: {
        // Use a transparent background on iOS to show the blur effect
        position: "absolute",
        backgroundColor: "transparent",
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        height: 85, // Aumenta la altura
        paddingBottom: 35, // Más espacio abajo
        paddingTop: 10,
        },
        default: {
        height: 70,
        paddingBottom: 20,
        paddingTop: 10,
        },
      }),
      }}
    >
      <Tabs.Screen
      name="index"
      options={{
        title: "Yo",
        tabBarIcon: ({ color }) => (
        <IconSymbol size={28} name="person.fill" color={color} />
        ),
      }}
      />
      <Tabs.Screen
      name="social"
      options={{
        title: "Mis oinks",
        tabBarIcon: ({ color }) => (
        <IconSymbol size={28} name="person.2.fill" color={color} />
        ),
      }}
      />
      <Tabs.Screen
      name="settings"
      options={{
        title: "Ajustes",
        tabBarIcon: ({ color }) => (
        <IconSymbol size={28} name="gearshape.fill" color={color} />
        ),
      }}
      />
    </Tabs>
  );
}
