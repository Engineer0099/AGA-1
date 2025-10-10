import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const endpoint = "https://fra.cloud.appwrite.io/v1";
const projectId = "68ca4989003b47647dea";
const bucketId = "68d2174c0000e21e68f0";

export default function FileViewer() {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      let response = await AsyncStorage.getItem("paper");
      if (!response) {
        setPreviewUrl(null);
        return;
      }

      const paper = JSON.parse(response);

      // Build the URL manually
      const url = `${endpoint}/storage/buckets/${bucketId}/files/${paper.fileId}/view?project=${projectId}`;
      console.log("Preview URL:", url);

      setPreviewUrl(url);
    })();
  }, []);

  if (!previewUrl) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Something Went Wrong!</Text>
      </SafeAreaView>
    );
  }

  return <WebView source={{ uri: previewUrl }} style={{ flex: 1 }} />;
}