// PDFDocument.js

import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

// Create PDF document component
const PDFDocument = ({
  data = "dsfsjewh rihierhi erirhtihti erit45t 4otj45otju45uj",
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>{data}</Text>
      </View>
    </Page>
  </Document>
);

export default PDFDocument;
