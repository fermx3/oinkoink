import React from "react";
import { FlatList, FlatListProps, ListRenderItem } from "react-native";
import EmptyListWithRefresh from "./EmptyListWithRefresh";

type Props<T> = {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor?: FlatListProps<T>["keyExtractor"];
  refreshing: boolean;
  onRefresh: () => void;
  emptyText?: string;
};

export default function FollowersList<T>({
  data,
  renderItem,
  keyExtractor,
  refreshing,
  onRefresh,
  emptyText = "No hay elementos",
}: Props<T>) {
  if (!data || data.length === 0) {
    return <EmptyListWithRefresh text={emptyText} refreshing={refreshing} onRefresh={onRefresh} />;
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor || ((item: any) => item.id)}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}
