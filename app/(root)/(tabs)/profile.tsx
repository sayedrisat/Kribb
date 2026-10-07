import { View, Text, TouchableOpacity } from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import { useAuth } from '@clerk/expo'
import { useRouter } from 'expo-router';


const profile = () => {
  const { signOut } = useAuth();

  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/signIn'); // Navigate to the login screen after sign-out
      // Handle successful sign-out, e.g., navigate to the login screen
    } catch (error) {
      console.error('Error signing out:', error);
      // Handle sign-out error, e.g., show an error message
    }
  }
  return (
    <SafeAreaView>
      <Text>profile</Text>
      <TouchableOpacity onPress={handleSignOut}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}
   

export default profile