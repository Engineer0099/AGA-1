import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";
import Pdf from "react-native-pdf";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const endpoint = "https://fra.cloud.appwrite.io/v1";
const projectId = "68ca4989003b47647dea";
const databaseId = "68ca66480039a017b799";
const bucketId = "68d2174c0000e21e68f0";

export default function FileViewer() {
  const { id } = useLocalSearchParams();
  const [fileId, setFileId] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchFileFromDatabase = async () => {
      try {
        // 1️⃣ Get document info from Appwrite database
        const response = await fetch(
          `${endpoint}/databases/${databaseId}/collections/files/documents/${id}`,
          {
            headers: {
              "X-Appwrite-Project": projectId,
            },
          }
        );

        const data = await response.json();

        if (data && data.$id) {
          // 2️⃣ Extract fileId and mimeType
          setFileId(data.fileId);
          setMimeType(data.mimeType);
        } else {
          console.warn("Document not found or invalid data:", data);
        }
      } catch (err) {
        console.error("Error fetching database row:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFileFromDatabase();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="gray" />
        <Text>Loading file...</Text>
      </SafeAreaView>
    );
  }

  if (!fileId || !mimeType) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>File not found in database.</Text>
      </SafeAreaView>
    );
  }

  // 3️⃣ Build Appwrite file view URL (stream, not download)
  const fileUrl = `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;

  // 4️⃣ Display based on file type
  if (mimeType.includes("pdf")) {
    return (
      <View style={styles.container}>
        <Pdf
          source={{ uri: fileUrl, cache: true }}
          style={styles.pdf}
          onError={(error) => console.log("PDF load error:", error)}
        />
      </View>
    );
  } else if (mimeType.startsWith("image/")) {
    return (
      <SafeAreaView style={styles.center}>
        <img
          src={fileUrl}
          alt="Document Image"
          style={styles.image}
        />
      </SafeAreaView>
    );
  } else if (
    mimeType.includes("msword") ||
    mimeType.includes("presentation") ||
    mimeType.includes("spreadsheet") ||
    mimeType.includes("officedocument")
  ) {
    // DOCX, PPTX, XLSX — use Microsoft Office online viewer
    return (
      <View style={styles.container}>
        <WebView
          originWhitelist={["*"]}
          style={{ flex: 1 }}
          source={{
            uri: `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`,
          }}
        />
      </View>
    );
  } else {
    // Fallback for any unknown format
    return (
      <SafeAreaView style={styles.center}>
        <Text>Unsupported file format: {mimeType}</Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  image: { 
    width: "100%", 
    height: "100%", 
    objectFit: "contain" 
  }
});
