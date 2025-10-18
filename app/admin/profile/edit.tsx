import { useUser } from '@/hooks/useUser';
import { databases } from '@/lib/appwrite';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const EditProfile = () => {
    const { user, setUser } = useUser();
    const [loading, setLoading] = React.useState(false);
    const [newData, setNewData] = React.useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || '',
        Phone: user?.phone || '',
    });

    const validation = () => {
        if ((newData.name.trim() === user?.name) && (newData.email.trim() === user?.email) && (newData.bio.trim() === user?.bio) && (newData.Phone.trim() === user?.phone)) {
            Alert.alert('Info', 'No changes made to the profile.');
            return false;
        }
        if (newData.name.trim().length < 3) {
            Alert.alert('Validation Error', 'Name must be at least 3 characters long.');
            return false;
        }
        if (newData.email.trim().length < 5 || !newData.email.includes('@')) {
            Alert.alert('Validation Error', 'Please enter a valid email address.');
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
            if (!user) throw new Error('User not found');
            let updatedData = {};
            if(user.name !== newData.name){
                updatedData = {...updatedData, name: newData.name}
            }
            if(user.email !== newData.email){
                updatedData = {...updatedData, email: newData.email}
            }
            if(user.bio !== newData.bio){
                updatedData = {...updatedData, bio: newData.bio}
            }   
            if(user.phone !== newData.Phone){
                updatedData = {...updatedData, phone: newData.Phone}
            }

            
            const updatedUser = await databases.updateDocument(
                '68ca66480039a017b799',
                'user',
                user.id,
                updatedData
                
            );
            setUser({...user, ...updatedUser});
            
        } catch (error) {
            console.error('Failed to update user:', error);
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
            router.back();
        }

    }

    if (!user) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="alert-circle-outline" size={48} color="#DC2626" style={{ marginBottom: 16 }} />
                <Text style={styles.sectionTitle}>Someting Went Wrong!</Text>
                <Text style={styles.value}>User data is not available.</Text>
            </View>
        );
    }
    return(
        <KeyboardAvoidingView behavior={Platform.OS === "android" ? "padding" : "height"} style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>

                <View style={styles.header}>
                    <Ionicons name="person-circle-outline" size={100} color="#6d9bdbff" />
                    <View style={{ alignItems: 'center', marginTop: 8 }}>
                        <Text style={styles.adminName}>{user.name}</Text>
                        <Text style={styles.welcomeText}>{user.email}</Text>
                        <Text style={[styles.welcomeText, {fontStyle: 'italic'}]}>{user.bio}</Text>
                    </View>
                </View>

                {/* Container with inputs for user to edit */}
                <View style={styles.section}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input}
                        value={newData.name || ''}
                        placeholder="Enter your name"
                        editable={true} 
                        onChangeText={(text) => setNewData({ ...newData, name: text })}
                    />
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={newData.email || ''}
                        placeholder="Enter your email"
                        editable={true} 
                        onChangeText={(text) => setNewData({ ...newData, email: text })}
                    />
                    <Text style={styles.label}>Bio</Text>
                    <TextInput
                        style={[styles.input, { height: 80 }]}
                        value={newData.bio || ''}
                        placeholder="Enter your bio"
                        editable={true} 
                        multiline
                        onChangeText={(text) => setNewData({ ...newData, bio: text })}
                    />
                    <Text style={styles.label}>Phone</Text>
                    <TextInput
                        style={styles.input}
                        value={newData.Phone || ''}
                        placeholder="Enter your phone number"
                        keyboardType="phone-pad"
                        editable={true} 
                        onChangeText={(text) => setNewData({ ...newData, Phone: text })}
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

