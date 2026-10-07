import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";


export default function HomeScreen() {
  const { isSignedIn, isLoaded } = useAuth()

  if(!isLoaded) return null;

  // redrect based on auth state
  if (isSignedIn) {
    return <Redirect href="/(root)/(tabs)"/>;
  }

  return <Redirect href="/signIn" />;
}
