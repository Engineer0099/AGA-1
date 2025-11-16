import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Access header and set visible

type HelpAndSupportContent = {
    type?: string;
    title: string;
    content: string;
}

const FileList: React.FC<{ content: string }> = ({ content }) => {
    return <Text style={styles.content}>{content}</Text>;
};

export default function HelpAndSupport() {
    const contents: HelpAndSupportContent[] = [
        {
            type: "info",
            title: "Getting Help",
            content: "For assistance, please contact our support team at support@aga.com.\nOr call us at +255622594202.\nWe are here to help you with any issues or questions you may have."
        },
        {
            type: "faq",
            title: "Frequently Asked Questions",
            content: "Q: How do I reset my password?\nA: Click on 'Forgot Password' at the login screen and follow the instructions."
        },
        {
            type: "contact",
            title: "Contact Us",
            content: "You can reach us at:\nPhone: +255622594202\nEmail: support@aga.com"
        },
        {
            type: "info",
            title: "Download Issues",
            content: "If you experience issues downloading files, please ensure you have a stable internet connection and sufficient storage space on your device. If problems persist, contact support."
        }
    ]
    return (
        <SafeAreaView style={styles.container}>
            {/* Header with back button */}
            <View style={{ marginBottom: 20, width: '100%', flexDirection: 'row', alignItems: 'center', gap: 15, backgroundColor: 'transparent' }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={[styles.title, { fontSize: 24, color: "#000", textAlign: 'center' }]}>Help & Support</Text>
            </View>
            
            {/* Content Section */}
            {contents.map((item, idx) => (
                <React.Fragment key={idx}>
                    <Text style={[styles.title, { fontSize: 18, marginTop: 12 }]}>{item.title}</Text>
                    <FileList content={item.content} />
                </React.Fragment>
            ))}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'System',
        color: '#333',
        marginBottom: 10,
    },
    content: {
        fontSize: 16,
        fontFamily: 'System',
        width: '100%',
        borderRadius: 8,
        padding: 15,
        backgroundColor: '#f9f9f9',
        lineHeight: 22,
        color: '#555',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
});