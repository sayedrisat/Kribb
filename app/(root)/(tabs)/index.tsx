import { View, Text } from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'


const HomePage = () => {
  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <View>
        <Text>HomePage</Text>
      </View>
    </SafeAreaView>
  )
}

export default HomePage