import React from "react";
import { View } from "react-native";
import PDF from "react-native-pdf";

export default function PDFViewer({ uri }: { uri: string }) {
  return (
    <View style={{ flex: 1 }}>
      <PDF
        source={{ uri }}
        style={{ flex: 1 }}
      />
    </View>
  );
}
