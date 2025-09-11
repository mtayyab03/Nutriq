import React, { useState, useEffect } from "react";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

//Cdnesdayomponents
import Screen from "../../components/Screen";
import AppLoading from "../../components/AppLoading";

// apis
import apiClient from "../../apis/apiClient";

//config
import Colors from "../../config/Colors";
import { FontFamily } from "../../config/font";
import icons from "../../config/icons";

const DiscoverScreen = ({ navigation }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [companyId, setCompanyId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0); // starts from 0
  const [totalPages, setTotalPages] = useState(1); // default 1 to allow first load
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const categories = [
    "All",
    "Breakfast",
    "Mid morning snack",
    "Lunch",
    "Afternoon snack",
    "Dinner",
  ];

  useEffect(() => {
    const fetchInitialRecipes = async () => {
      try {
        setIsLoading(true);
        const companyRes = await apiClient.get("/client/companies");

        if (companyRes.status === 200 && companyRes.data.length > 0) {
          const companyId = companyRes.data[0].id;
          setCompanyId(companyId);
          fetchRecipes(companyId, 0); // Fetch page 0
        }
      } catch (err) {
        console.log("Error fetching companies:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialRecipes();
  }, []);
  const fetchRecipes = async (companyId, pageNum) => {
    if (pageNum >= totalPages) return; // prevent extra requests

    try {
      if (pageNum === 0) setIsLoading(true);
      else setIsFetchingMore(true);

      const res = await apiClient.get(
        `/client/company/${companyId}/recipes?page=${pageNum}`
      );

      if (res?.data?.content) {
        const newItems = res.data.content.map((item) => ({
          id: item.id,
          image: item.image,
          title: item.name,
          description: item.description,
          categories: item.categories?.map((cat) => cat.value) || [],
        }));

        setFoodItems((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const filteredNewItems = newItems.filter(
            (item) => !existingIds.has(item.id)
          );
          return [...prev, ...filteredNewItems];
        });
        setTotalPages(res.data.totalPages);
        setPage(pageNum + 1); // move to next page
      }
    } catch (err) {
      console.log("Error fetching recipes:", err);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true); // Start loading
        // First, fetch the companies
        const companyRes = await apiClient.get("/client/companies");

        if (companyRes.status === 200 && companyRes.data.length > 0) {
          const companyId = companyRes.data[0].id; // Assuming the first company is used
          setCompanyId(companyId);

          // Now fetch recipes using the companyId
          const recipeRes = await apiClient.get(
            `/client/company/${companyId}/recipes`
          );

          if (recipeRes?.data?.content) {
            const data = recipeRes.data.content;

            const parsed = data.map((item) => ({
              id: item.id,
              image: item.image,
              title: item.name,
              description: item.description,
              categories: item.categories?.map((cat) => cat.value) || [],
            }));

            setFoodItems(parsed);
          }
        }
      } catch (err) {
        console.log("Error fetching recipes or companies:", err);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchRecipes();
  }, []);

  const filteredItems =
    selectedCategory === "All"
      ? foodItems
      : foodItems.filter((item) => item.categories.includes(selectedCategory));

  return (
    <Screen style={styles.screen}>
      <View style={{ width: "90%", marginTop: RFPercentage(1) }}>
        <Text
          style={{
            color: Colors.blacky,
            fontFamily: FontFamily.medium,
            fontSize: RFPercentage(2.3),
          }}
        >
          Recipies
        </Text>
      </View>

      {/* category */}
      <View
        style={{
          width: "100%",
          marginVertical: RFPercentage(2),
        }}
      >
        <ScrollView
          style={{ width: "100%" }}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            marginLeft: RFPercentage(2),
            paddingRight: RFPercentage(2),
          }}
        >
          {categories.map((item) => (
            <TouchableOpacity
              activeOpacity={0.7}
              key={item}
              onPress={() => setSelectedCategory(item)}
              style={[
                styles.button,
                {
                  backgroundColor:
                    selectedCategory === item ? Colors.primary : "transparent",
                  borderColor:
                    selectedCategory === item ? Colors.primary : Colors.stroke,
                },
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color:
                      selectedCategory === item
                        ? Colors.white
                        : Colors.blacksuit,
                  },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* recipies */}

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: "3%",
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate("RecipieScreen", {
                recipeId: item.id,
                companyId: companyId,
                imageRecipe: item.image,
              })
            }
            style={{
              width: "49%",
              borderWidth: 1,
              borderColor: Colors.stroke,
              padding: RFPercentage(1),
              borderRadius: RFPercentage(1),
              alignItems: "center",
              marginVertical: RFPercentage(0.5),
              overflow: "hidden",
            }}
          >
            {item.image && (
              <Image
                style={{
                  width: RFPercentage(18),
                  height: RFPercentage(15),
                  borderRadius: RFPercentage(1),
                }}
                source={{ uri: item.image }}
                resizeMode="cover"
              />
            )}
            <View style={{ width: "100%" }}>
              <Text
                style={{
                  marginTop: RFPercentage(0.5),
                  color: Colors.blacky,
                  fontFamily: FontFamily.medium,
                  fontSize: RFPercentage(1.8),
                }}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  marginTop: RFPercentage(0.5),
                  color: Colors.blacksuit,
                  fontFamily: FontFamily.regular,
                  fontSize: RFPercentage(1.2),
                }}
              >
                {item.description.split(" ").slice(0, 10).join(" ") +
                  (item.description.split(" ").length > 10 ? " ..." : "")}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        onEndReached={() => {
          if (!isFetchingMore && page < totalPages) {
            fetchRecipes(companyId, page);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingMore ? (
            <ActivityIndicator color={Colors.primary} size={50} />
          ) : null
        }
      />

      {/* {isLoading ? (
        <AppLoading />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          style={{ width: "100%" }}
        >
          <View
            style={{
              width: "90%",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {filteredItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate("RecipieScreen", {
                    recipeId: item.id,
                    companyId: companyId, // make sure this is available in your component state
                    imageRecipe: item.image,
                  })
                }
                style={{
                  width: "48%",
                  borderWidth: 1,
                  borderColor: Colors.stroke,
                  padding: RFPercentage(1),
                  borderRadius: RFPercentage(1),
                  alignItems: "center",
                  // justifyContent: "center",
                  marginVertical: RFPercentage(0.7),
                }}
              >
                {item.image && (
                  <Image
                    style={{
                      width: RFPercentage(18),
                      height: RFPercentage(15),
                      borderRadius: RFPercentage(1),
                    }}
                    source={item.image}
                    resizeMode="cover"
                  />
                )}
                <View style={{ width: "100%" }}>
                  <Text
                    style={{
                      marginTop: RFPercentage(0.5),
                      color: Colors.blacky,
                      fontFamily: FontFamily.medium,
                      fontSize: RFPercentage(1.8),
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      marginTop: RFPercentage(0.5),
                      color: Colors.blacksuit,
                      fontFamily: FontFamily.regular,
                      fontSize: RFPercentage(1.2),
                    }}
                  >
                    {item.description.split(" ").slice(0, 10).join(" ") +
                      (item.description.split(" ").length > 10 ? " ..." : "")}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )} */}
    </Screen>
  );
};

export default DiscoverScreen;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  scrollContent: {
    width: "100%",
    paddingBottom: RFPercentage(2),
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    paddingVertical: RFPercentage(1),
    paddingHorizontal: RFPercentage(2.5),
    borderRadius: RFPercentage(3),
    borderWidth: 1,
    marginRight: RFPercentage(1.5),
  },
  buttonText: {
    fontSize: RFPercentage(1.5),
    fontFamily: FontFamily.regular,
  },
});
