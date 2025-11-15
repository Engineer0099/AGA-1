// components/PDFViewer.web.tsx
import React from "react";

export default function PDFViewer({ uri }: { uri: string }) {
  return (
    <iframe
      src={uri}
      style={{ width: "100%", height: "100%", border: "none" }}
    />
  );
}
