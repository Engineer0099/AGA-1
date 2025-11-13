import { databases } from '@/lib/appwrite';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Query } from 'react-native-appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';

type Tip = {
    $id: string;
    title: string;
    content: string;
};

const EditProfile = () => {
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [tip, setTip] = useState<Tip | null>(null);
    const [newData, setNewData] = useState<Tip | null>({
        $id: tip?.$id || '',
        title: tip?.title || '',
        content: tip?.content || '',
    });
    
    useEffect(() => {
        setLoading(true);
        if(!id){
            return;
        }
        ( async() => {
            try{
                const study_tip = await databases.listDocuments(
                    '68ca66480039a017b799',
                    'study_tip',
                     [
                        Query.equal("$id", id)
                    ]
                )
                const fetchedTip = study_tip?.documents?.map((doc: any) => ({
                    id: doc.$id,
                    title: doc.title,
                    content: doc.content,
                }));
                setTip(fetchedTip[0] as any);
                setNewData(fetchedTip[0] as any);
            } catch (err){
                console.log("Error Fetching Tip Details: ", err);
            } finally {
                setLoading(false);
            }
        })()
        
    }, [id]);
    console.log(tip);

    const validation = () => {
        if ((newData?.title.trim() === tip?.title) && (newData?.content.trim() === tip?.content)) {
            Alert.alert('Info', 'No changes made to the tip profile.');
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
            if(tip?.title !== newData?.title){
                updatedData = {...updatedData, title: newData?.title}
            }
            if(tip?.content !== newData?.content){
                updatedData = {...updatedData, content: newData?.content}
            }

            
            const updatedTip = await databases.updateDocument(
                '68ca66480039a017b799',
                'study_tip',
                id as any,
                updatedData
                
            );
            setTip({...tip, ...updatedTip} as any);
            
        } catch (error) {
            console.error('Failed to update tip:', error);
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
                        <Text style={styles.adminName}>{tip?.title || 'Tip Title...'}</Text>
                    </View>
                </View>

                {/* Container with inputs for tip to edit */}
                <View style={styles.section}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        style={styles.input}
                        value={newData?.title || ''}
                        placeholder="Enter Tip Title..."
                        editable={true} 
                        onChangeText={(text) => setNewData({ ...newData, title: text } as any)}
                    />
                    <Text style={styles.label}>Content</Text>
                    <TextInput
                        style={[styles.input, { height: 80 }]}
                        value={newData?.content || ''}
                        placeholder="Enter your content..."
                        editable={true} 
                        multiline
                        onChangeText={(text) => setNewData({ ...newData, content: text } as any)}
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

