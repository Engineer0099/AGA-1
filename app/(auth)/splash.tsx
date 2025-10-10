import { useUser } from '@/hooks/useUser';
import { account, databases } from '@/lib/appwrite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export async function saveUserLocally(user: any) {
  try {
    await AsyncStorage.setItem('currentUser', JSON.stringify(user));
  } catch (error) {
    console.error("Failed to save user locally", error);
  }
}

export async function getUserLocally() {
  try {
    const userString = await AsyncStorage.getItem('currentUser');
    if (!userString) return null;
    return JSON.parse(userString);
  } catch (error) {
    console.error("Failed to load user locally", error);
    return null;
  }
}


export default function SplashScreen() {
  const {setUser} = useUser()
  useEffect(() => {
    const checkUserAndOnboarding = async () => {
      try {
        // 1️⃣ Check onboarding
        const onboardingComplete = await AsyncStorage.getItem('onboardingComplete');

        // 2️⃣ Check Appwrite session
        let user = null;

        try {
          user = await account.get(); // online
          let doc;
          try {
            doc = await databases.getDocument("68ca66480039a017b799", "user", user.$id);
          } catch (err) {
            console.warn("Failed to fetch user profile:", err);
          }

          const mappedRole: "admin" | "teacher" | "student" =
            doc?.role === "admin" || doc?.role === "teacher" || doc?.role === "student"
              ? doc.role
              : "student";

          user = ({
            id: user.$id,
            name: user.name ?? "User",
            email: user.email,
            role: mappedRole,
          });
          await saveUserLocally(user);
        } catch {
          user = await getUserLocally(); // offline
        }

        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
        // 3️⃣ Delay splash screen for 2 seconds
        setTimeout(() => {
          // if (!onboardingComplete || onboardingComplete !== 'true') {
          //   router.replace('/(auth)/onboarding');
          // } else 
          if (!user) {
            router.replace('/(auth)/signin'); // Not logged in
          } else if (user.role === 'admin') {
            router.replace('/admin'); // Admin user
          } else {
            router.replace('/(tabs)/library'); // Logged in
          }
        }, 2000);
      } catch (e) {
        console.error('Error checking onboarding or session', e);
        setTimeout(() => {
          router.replace('/(auth)/onboarding');
        }, 2000);
      }
    };

    checkUserAndOnboarding();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>AGA</Text>
        </View>
        <Text style={styles.tagline}>
          Learn faster. Stay organized.{'\n'}All Tanzanian school levels in one place.
        </Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>from KISO</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', padding: 20 },
  logoContainer: { alignItems: 'center' },
  logo: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#4A6FA5', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  logoText: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  tagline: { textAlign: 'center', fontSize: 18, color: '#6B7280', marginTop: 16, lineHeight: 26 },
  footer: { position: 'absolute', bottom: 50 },
  footerText: { fontSize: 16, color: '#9CA3AF', fontWeight: '500' },
});
