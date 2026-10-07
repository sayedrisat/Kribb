import { useAuth, useSignIn } from '@clerk/expo';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react'
import { View, Text, ScrollView, Image, TextInput, Touchable, TouchableOpacity, ActivityIndicator } from 'react-native'
import signUp from './signUp';



const signIn = () => {
  const { errors, signIn, fetchStatus } = useSignIn();

  const router = useRouter()


  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")

  const isLoading = fetchStatus === 'fetching';


    const onSignInPress = async () => {
    const { error } = await signIn.password({
      emailAddress: email,
      password,
    })

    if(error){
      alert(error.message)
      return;
    }

    if(signIn.status === "complete"){
      await signIn.finalize({
        navigate: ({session, decorateUrl}) => {
          if(session?.currentTask){
            console.log(session?.currentTask);
            return 
          }
          const url = decorateUrl("/");
          router.replace(url as any);
        }
      });
    }else if(signIn.status === "needs_second_factor"){
      await signIn.mfa.sendEmailCode();
    }
    else if(signIn.status === "needs_client_trust"){
      const emailCodeFactor = signIn.supportedSecondFactors.find((factor) => factor.strategy === "email_code");
      if(emailCodeFactor){
        await signIn.mfa.sendEmailCode();
      }else{
        console.error("Sign In Attempt not complete:", signIn);
      }
  }
}

  const onVerifyPress = async () => {
    await signIn.mfa.verifyEmailCode({ code });

    if(signIn.status === "complete"){
      await signIn.finalize({
        navigate: ({session, decorateUrl}) => {
          if(session?.currentTask){
            console.log(session?.currentTask);
            return 
          }
          const url = decorateUrl("/");
          router.replace(url as any);
        }
      })
  }
}

  if(signIn.status === "needs_client_trust"){
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

              <TouchableOpacity onPress={async () => signIn.mfa.sendEmailCode()} >
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
            <Text className='text-3xl font-bold text-gray-800 mb-2'>Welcome Back</Text>
            <Text className='text-gray-500 mb-8'>Sign in to your account</Text>




              <TextInput
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#9CA3AF"
                autoCapitalize='none'
                keyboardType='email-address'
                className="border border-gray-300 rounded-xl py-3 px-4 mb-4"
              />
              {errors.fields.identifier && (<Text className='text-red-500 mb-2'>{errors.fields.identifier.message}</Text>)}


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
              onPress={onSignInPress}
               disabled={isLoading}
              className="w-full bg-blue-600 items-center py-4 rounded-xl mt-4">
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ): <Text className="text-white font-bold text-base">Sign In</Text>}

              </TouchableOpacity>

            <View className='flex-row justify-center '>
              <Text className='text-gray-500'>Don&apos;t have an account? </Text>
              <Link href="/signUp" className='text-blue-600 font-bold'>Sign Up</Link>

              <View nativeID="clerk-captcha"></View>

            </View>

        </View>

    </ScrollView>
  )
}

export default signIn