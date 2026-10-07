import { useSignUp, useAuth } from '@clerk/expo';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react'
import { View, Text, ScrollView, Image, TextInput, Touchable, TouchableOpacity, ActivityIndicator } from 'react-native'



const signUp = () => {
  const { errors, signUp, fetchStatus } = useSignUp();
  const {isSignedIn} = useAuth()

  const router = useRouter()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")

  const isLoading = fetchStatus === 'fetching';

  if(signUp.status === "complete" || isSignedIn){
    return null;
  }

    const onSignUpPress = async () => {
    const { error } = await signUp.password({
      firstName,
      lastName,
      emailAddress: email,
      password,
    })

    if(error){
      alert(error.message)
      return;
    }

    if(!error) await signUp.verifications.sendEmailCode();
  }

  const onVerifyPress = async () => {
    await signUp.verifications.verifyEmailCode({ code });

    if(signUp.status === "complete"){
      await signUp.finalize({
        navigate: ({decorateUrl}) => {
          const url = decorateUrl("/");
          router.replace(url as any);
        }
      })
  }
}

  if(
    signUp.status === "missing_requirements" && signUp.unverifiedFields.includes("email_address") && signUp.missingFields.length === 0
  ){
    return (
      <View className='flex-1 justify-center px-6 py-12'>
            <Image source={require('../../assets/images/kribb.png')} className='w-32 h-16 mb-8'resizeMode='contain' />
            <Text className='text-3xl font-bold text-gray-800 mb-2'>Verify your account {" "}</Text>
            <Text className='text-gray-500 mb-8'>we sent a code to {email}</Text>

            
              <TextInput
                placeholder="Enter verification code"
                placeholderTextColor="#9CA3AF"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                className="border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {errors.fields.code && (<Text className='text-red-500 mb-2'>{errors.fields.code.message}</Text>)}

              <TouchableOpacity
              onPress={onVerifyPress}
               disabled={isLoading}
              className="w-full bg-blue-600 items-center py-4 rounded-xl mt-4">
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ): <Text className="text-white font-bold text-base">Verify</Text>}

              </TouchableOpacity>

              <TouchableOpacity onPress={async () => signUp.verifications.sendEmailCode()} >
                <Text className='text-blue-600 font-bold mt-4'>Resend code</Text>
              </TouchableOpacity>
  


            </View>
    )
  }

  return (
    <ScrollView 
    contentContainerStyle={{ flexGrow: 1 }} className='bg-white'
    keyboardShouldPersistTaps='handled'
    >
        <View className='flex-1 justify-center px-6 py-12'>
            <Image source={require('../../assets/images/kribb.png')} className='w-32 h-16 mb-8'resizeMode='contain' />
            <Text className='text-3xl font-bold text-gray-800 mb-2'>Create Account</Text>
            <Text className='text-gray-500 mb-8'>Find your dream home today</Text>

            <View className='flex-row gap-3 mb-4'>
              <TextInput
                placeholder="First Name"
                placeholderTextColor="#9CA3AF"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize='words'
                className="border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <TextInput
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                placeholderTextColor="#9CA3AF"
                autoCapitalize='words'
                className="border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </View>



              <TextInput
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#9CA3AF"
                autoCapitalize='none'
                keyboardType='email-address'
                className="border border-gray-300 rounded-xl py-3 px-4 mb-4"
              />
              {errors.fields.emailAddress && (<Text className='text-red-500 mb-2'>{errors.fields.emailAddress.message}</Text>)}


              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#9CA3AF"
                className="border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.fields.password && (<Text className='text-red-500 mb-2'>{errors.fields.password.message}</Text>)}

              <TouchableOpacity
              onPress={onSignUpPress}
               disabled={isLoading}
              className="w-full bg-blue-600 items-center py-4 rounded-xl mt-4">
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ): <Text className="text-white font-bold text-base">Sign Up</Text>}

              </TouchableOpacity>

            <View className='flex-row justify-center '>
              <Text className='text-gray-500'>Already have an account? </Text>
              <Link href="/signIn" className='text-blue-600 font-bold'>Sign In</Link>

              <View nativeID="clerk-captcha"></View>

            </View>

        </View>

    </ScrollView>
  )
}

export default signUp