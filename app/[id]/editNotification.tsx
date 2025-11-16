import { fetchDocumentsWithQuery, updateDocumentById } from '@/utils/util';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Query } from 'react-native-appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';

type Notification = {
    $id: string;
    title: string;
    message: string;
};

const EditProfile = () => {
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<Notification | null>(null);
    const [newData, setNewData] = useState<Notification | null>({
        $id: notification?.$id || '',
        title: notification?.title || '',
        message: notification?.message || '',
    });
    
    useEffect(() => {
        setLoading(true);
        if(!id){
            return;
        }
        ( async() => {
            try{
                const notification = await fetchDocumentsWithQuery(
                    '68ca66480039a017b799',
                    'notification',
                     [
                        Query.equal("$id", id)
                    ]
                )
                const fetchedNotification = notification?.map((doc: any) => ({
                    id: doc.$id,
                    title: doc.title,
                    message: doc.message,
                }));
                setNotification(fetchedNotification[0] as any);
                setNewData(fetchedNotification[0] as any);
            } catch (err){
                console.log("Error Fetching Notification Details: ", err);
            } finally {
                setLoading(false);
            }
        })()
        
    }, [id]);
    console.log(notification);

    const validation = () => {
        if ((newData?.title.trim() === notification?.title) && (newData?.message.trim() === notification?.message)) {
            Alert.alert('Info', 'No changes made to the notification profile.');
            return false;
        }
        return true;
    };
    const HandleSubmit = async () => {
        // update to the database
        setLoading(true);
        if (!validation()) {
            setLoading(false);
            return;
        }
        try {
            let updatedData = {};
            if(notification?.title !== newData?.title){
                updatedData = {...updatedData, title: newData?.title}
            }
            if(notification?.message !== newData?.message){
                updatedData = {...updatedData, message: newData?.message}
            }

            
            const updatedNotification = await updateDocumentById(
                '68ca66480039a017b799',
                'notification',
                id as any,
                updatedData
                
            );
            setNotification({...notification, ...updatedNotification} as any);
            
        } catch (error) {
            console.error('Failed to update Notification:', error);
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
            router.back();
        }

    }

    return(
        <KeyboardAvoidingView behavior={Platform.OS === "android" ? "padding" : "height"} style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>

                <View style={styles.header}>
                    <Ionicons name="book-outline" size={100} color="#6d9bdbff" />
                    <View style={{ alignItems: 'center', marginTop: 8 }}>
                        <Text style={styles.adminName}>{notification?.title || 'Notification Title...'}</Text>
                    </View>
                </View>

                {/* Container with inputs for Notification to edit */}
                <View style={styles.section}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        style={styles.input}
                        value={newData?.title || ''}
                        placeholder="Enter Notification Title..."
                        editable={true} 
                        onChangeText={(text) => setNewData({ ...newData, title: text } as any)}
                    />
                    <Text style={styles.label}>Message</Text>
                    <TextInput
                        style={[styles.input, { height: 80 }]}
                        value={newData?.message || ''}
                        placeholder="Enter your message..."
                        editable={true} 
                        multiline
                        onChangeText={(text) => setNewData({ ...newData, message: text } as any)}
                    />
                    <TouchableOpacity style={[styles.logoutButton, { marginTop: 16 }]} onPress={HandleSubmit}>
                        {loading ? (
                            <ActivityIndicator size="small" color="#2563EB" />
                        ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="save-outline" size={18} color="#2563EB" />
                                <Text style={styles.logoutButtonText}>Save Changes</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    
                </View>

            </SafeAreaView>
        </KeyboardAvoidingView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        padding: 16,
    },
    header: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EDF2F7',
        marginBottom: 16,
    },
    adminName: {
        fontSize: 24,
        fontWeight: '600',
        color: '#111827',
    },
    welcomeText: {
        fontSize: 16,
        color: '#6B7280',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
    },
    section: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },
    value: {
        fontSize: 16,
        color: '#111827',
    },
    input: {
        height: 40,
        borderColor: '#D1D5DB',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 16,
        backgroundColor: '#F9FAFB',
        color: '#111827',
    },
    logoutButton: {
        padding: 10,
        backgroundColor: '#EFF6FF',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutButtonText: {
        marginLeft: 4,
        color: '#2563EB',
        fontWeight: '500',
    },

});
export default EditProfile;

