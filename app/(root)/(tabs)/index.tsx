import { useUser } from "@clerk/expo";
import { Ionicons } from "@react-native-vector-icons/ionicons"
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Property } from "../../../types";
import { supabase } from "../../../lib/supabase";
import FeaturedCard from "../../../components/FeaturedCard";
import PropertyCard from "../../../components/PropertyCard";

const HomePage = () => {
  const { user } = useUser();
  const router = useRouter();

  const [featured, setFeatured] = useState<Property[]>([]);
  const [recommended, setRecommended] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);


  const fatchProperties = async () => {
    setLoading(true);

    const { data: featuredData } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: false });

    const { data: recommendedData } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: false });

    setFeatured(featuredData ?? []);
    setRecommended(recommendedData ?? []);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fatchProperties();
    }, []),
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={recommended}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* header */}
            <View className="flex-row items-center justify-between px-5 pt-4 pb-5">
              <Image
                source={require("../../../assets/images/kribb.png")}
                style={{ width: 90, height: 36 }}
                resizeMode="contain"
              />

              <View className="items-end">
                <Text>Good Morning..</Text>
                <Text className="text-gray-900 text-base font-bold">
                  {user?.firstName ?? "User"}
                </Text>
              </View>
            </View>

            {/* search bar */}
            <TouchableOpacity
              onPress={() => router.push("/(root)/(tabs)/search")}
              className="mx-5 mb-6 flex-row items-center bg-white rounded-2xl py-3 px-4 gap-3"
              style={{
                shadowColor: "000",
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.06,
                shadowRadius: 6,
                elevation: 2
              }}
            >
              <Ionicons name="search-outline" size={22} color="#6B7280" />
              <Text className="text-gray-400 text-sm flex-1">
                Search properties, cities...
              </Text>

              <TouchableOpacity onPress={() => router.push("/(root)/(tabs)/search?openFilters=ture")}
                className="w-8 h-8 bg-blue-600 rounded-xl items-center justify-center"
                >
                <Ionicons name="options-outline" size={15} color="white"/>

              </TouchableOpacity>


            </TouchableOpacity>

            {/* Featured Section */}
            <View className="mb-6">
              <Text className="text-gray-900 text-lg font-bold px-5 mb-4">
                Featured
              </Text>

              {loading ? (
                <ActivityIndicator
                size="small"
                color="#2563EB"
                className="py-10"
                />
              ) : <FlatList
              data={featured}
              keyExtractor={(item)=> item.id}
              renderItem={({item})=> <FeaturedCard property={item}/>}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{paddingHorizontal: 20}}
              /> }
            </View>

            {/* Recomended Header */}
            <Text className="text-gray-900 text-lg font-bold px-5 mb-4">
              Recommended
            </Text>
          </View>
        }

        renderItem={({ item }) => (
          <View className="px-5">
            <PropertyCard property={item}/>
          </View>
        )}

        ListEmptyComponent={
          !loading ? (
            <View className="items-center py-10">
              <Text className="text-gray-400">No properties found</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default HomePage;
