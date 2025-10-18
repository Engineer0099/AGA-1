import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const endpoint = "https://fra.cloud.appwrite.io/v1";
const projectId = "68ca4989003b47647dea";
const bucketId = "68d2174c0000e21e68f0";

export default function FileViewer() {
    const { id } = useLocalSearchParams();
    console.log(id);
  

    
    const url = `${endpoint}/storage/buckets/${bucketId}/files/${id}/view?project=${projectId}`;
      
     
  if (!id) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Something Went Wrong!</Text>
      </SafeAreaView>
    );
  }

  return <WebView source={{ uri: url }} style={{ flex: 1 }} />;
}