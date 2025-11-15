import { databases } from "@/lib/appwrite";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, View } from "react-native";
//import Pdf from "react-native-pdf";
//import PDFViewer from "@/components/PDFViewer";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";


const endpoint = "https://fra.cloud.appwrite.io/v1";
const projectId = "68ca4989003b47647dea";
const databaseId = "68ca66480039a017b799";
const bucketId = "68d2174c0000e21e68f0";

export default function PaperView() {
  const { id } = useLocalSearchParams();
  const [fileId, setFileId] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchFileFromDatabase = async () => {
      try {
        // 1️⃣ Get document info from Appwrite database
        const response = await databases.getDocument(
          databaseId,
          "past_paper",
          id as string
        );
        console.log("Database response:", response);

        const data = response;

        if (data && data.$id) {
          // 2️⃣ Extract fileId and mimeType
          setFileId(data.fileId);
          setFileType(data.fileType);
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

  if (!fileId || !fileType) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>File not found in database.</Text>
      </SafeAreaView>
    );
  }

  // 3️⃣ Build Appwrite file view URL (stream, not download)
  //const previewUrl = `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/preview?project=${projectId}&width=1024&height=1024`;
  const fileUrl = `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
  const fileUrl2 = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true` as string;


  // 4️⃣ Display based on file type
  if (fileType.toLowerCase().includes("pdf")) {
    return (
      <SafeAreaView style={styles.container}>
        <WebView
          source={{ uri: fileUrl2 }}
          style={styles.pdf}
          startInLoadingState
          renderLoading={() => <ActivityIndicator size="large" style={{flex: 1, justifyContent: "center", alignItems: "center"}} />}
        />
      </SafeAreaView>
    );
  } else if (fileType.toLowerCase().includes("image")) {
    return (
      <SafeAreaView style={styles.center}>
        <Image
          source={{ uri: fileUrl }}
          accessibilityLabel="Document Image"
          style={styles.image}
          resizeMode="contain"
        />
      </SafeAreaView>
    );
  } else if (
    fileType.includes("DOC") ||
    fileType.includes("PPTX") ||
    fileType.includes("XLSX") ||
    fileType.includes("officedocument")
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
        <Text>Unsupported file format: {fileType}</Text>
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
