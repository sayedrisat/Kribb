import { useAuth } from "@clerk/expo";
import { Redirect, Slot } from "expo-router";

export default function RootLayout() {
    const { isSignedIn, isLoaded } = useAuth()

    // sync clerk user -> supbase (i'll build this later)

    if(!isLoaded) return null;

    if (!isSignedIn) {
        return <Redirect href="/signIn"/>;
    }
  return <Slot />;
}