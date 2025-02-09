import React, { useState, useEffect } from "react";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import {
  Ionicons,
  AntDesign,
  Entypo,
  Fontisto,
  MaterialIcons,
} from "@expo/vector-icons";
import { db, storage } from "../../firebase"; // Assuming db is your Firestore instance
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

//Components
import Screen from "../components/Screen";

//config
import icons from "../config/icons";
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";

const HomeScreen = ({ navigation }) => {
  const [cards, setCards] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Select Category");
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); // For dot indicator

  const handleCategorySelect = (item) => {
    setSelectedCategory(item);
    setIsCategoryModalVisible(false); // Close the modal after selecting
  };

  const categories = ["Raw Material", "Machine"];

  // Fetch data from Firestore
  useEffect(() => {
    const postsCollection = collection(db, "posts");
    const unsubscribe = onSnapshot(postsCollection, (querySnapshot) => {
      const fetchedPosts = querySnapshot.docs.map((doc) => doc.data());
      setCards(fetchedPosts);
      console.log("Fetch data", cards);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const filteredCards =
    selectedCategory === "Select Category"
      ? cards
      : cards.filter(
          (card) =>
            card.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  const clearFilters = () => {
    setSelectedCategory("Select Category"); // Reset to default
  };

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(
      contentOffsetX / event.nativeEvent.layoutMeasurement.width
    );
    setCurrentIndex(index);
  };

  return (
    <Screen style={styles.screen}>
      {/* header */}
      <View
        style={{
          flexDirection: "row",
          width: "90%",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: RFPercentage(2),
        }}
      >
        <Text
          style={{
            fontFamily: FontFamily.medium,
            fontSize: RFPercentage(2.2),
            color: Colors.white,
          }}
        >
          RawE
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("NewPostScreen")}
          activeOpacity={0.7}
          style={{
            paddingVertical: RFPercentage(1),
            paddingHorizontal: RFPercentage(2),
            borderRadius: RFPercentage(0.7),
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: Colors.primary,
          }}
        >
          <Text
            style={{
              fontFamily: FontFamily.medium,
              fontSize: RFPercentage(1.5),
              color: Colors.white,
            }}
          >
            New Post
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          width: "100%",
          marginVertical: RFPercentage(1.5),
          height: RFPercentage(0.06),
          backgroundColor: Colors.lightWhite,
          borderRadius: RFPercentage(0.5),
        }}
      />

      <View
        style={{
          width: "90%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: RFPercentage(1),
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setIsCategoryModalVisible(true); // Set to true for categories
          }}
          activeOpacity={0.7}
          style={{
            width: "75%",
            height: RFPercentage(6),
            borderRadius: RFPercentage(0.7),
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: Colors.primary,
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              fontFamily: FontFamily.semiBold,
              fontSize: RFPercentage(2),
              color: Colors.white,
            }}
          >
            {selectedCategory}
          </Text>
          <MaterialIcons
            color={Colors.white}
            size={28}
            name="keyboard-arrow-down"
          />
        </TouchableOpacity>

        {/* clear button */}
        <TouchableOpacity
          onPress={clearFilters}
          activeOpacity={0.7}
          style={{
            height: RFPercentage(6),
            width: "20%",
            borderRadius: RFPercentage(0.7),
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: Colors.ligthBlack,
            borderWidth: 1,
            borderColor: Colors.lightWhite,
          }}
        >
          <Text
            style={{
              fontFamily: FontFamily.medium,
              fontSize: RFPercentage(1.5),
              color: Colors.white,
            }}
          >
            Clear
          </Text>
        </TouchableOpacity>
      </View>
      {/* insta card */}
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          paddingBottom: RFPercentage(3),
          marginTop: RFPercentage(2),
        }}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
      >
        {filteredCards.map((item, i) => (
          <View
            key={i}
            style={{
              width: "98%",
              marginBottom: RFPercentage(4),
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "92%",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: RFPercentage(1),
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  style={{
                    width: RFPercentage(4),
                    height: RFPercentage(4),
                    borderRadius: RFPercentage(3),
                  }}
                  source={icons.profile1}
                />

                <Text
                  style={{
                    fontFamily: FontFamily.medium,
                    fontSize: RFPercentage(1.5),
                    color: Colors.white,
                    marginLeft: RFPercentage(1.5),
                  }}
                >
                  Anna Marie
                </Text>
              </View>

              <Entypo
                name="dots-three-horizontal"
                color={Colors.lightWhite}
                size={18}
              />
            </View>

            {/* image */}
            {item.images.length > 1 ? (
              <>
                {/* Swiper */}
                <FlatList
                  data={item.images}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={handleScroll}
                  renderItem={({ item: media, index }) => (
                    <Image
                      key={index}
                      style={styles.mediaImage}
                      source={{ uri: media }}
                    />
                  )}
                />

                {/* Dot Indicator */}
                <View style={styles.dotsContainer}>
                  {item.images.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.dot,
                        currentIndex === index && styles.activeDot,
                      ]}
                    />
                  ))}
                </View>
              </>
            ) : (
              // Single image
              <Image
                style={styles.mediaImage}
                source={{ uri: item.images[0] }}
              />
            )}

            {/* like comment section */}
            <View
              style={{
                width: "92%",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: RFPercentage(1),
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleLikeToggle(item.id)} // Trigger like toggle for this card
                >
                  <Text
                    style={{
                      fontFamily: FontFamily.semiBold,
                      fontSize: RFPercentage(1.8),
                      color: Colors.white,
                      marginTop: RFPercentage(1.3),
                    }}
                  >
                    {item.title}
                  </Text>

                  <Text
                    style={{
                      fontFamily: FontFamily.regular,
                      fontSize: RFPercentage(1.3),
                      color: Colors.white,
                      marginTop: RFPercentage(1),
                    }}
                  >
                    Price per kg/meter: {item.price}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  paddingVertical: RFPercentage(1),
                  paddingHorizontal: RFPercentage(2.5),
                  borderRadius: RFPercentage(0.7),
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: Colors.primary,
                }}
              >
                <Text
                  style={{
                    fontFamily: FontFamily.medium,
                    fontSize: RFPercentage(1.5),
                    color: Colors.white,
                  }}
                >
                  Contact
                </Text>
              </TouchableOpacity>
            </View>

            {/* caption */}
            <View
              style={{
                width: "92%",
                marginTop: RFPercentage(1.4),
              }}
            >
              <Text
                style={{
                  fontFamily: FontFamily.regular,
                  fontSize: RFPercentage(1.2),
                  color: Colors.white,
                }}
              >
                {item.caption}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={isCategoryModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsCategoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity
                onPress={() => setIsCategoryModalVisible(false)}
              >
                <MaterialIcons name="close" size={24} color={Colors.white} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <FlatList
                data={categories}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.categoryItem}
                    onPress={() => handleCategorySelect(item)}
                  >
                    <Text style={styles.categoryItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </View>
      </Modal>
      {/* modal end */}
    </Screen>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.blacky,
  },

  // flatlist swiper

  mediaImage: {
    width: RFPercentage(51),
    height: RFPercentage(40),
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: RFPercentage(1),
  },
  dot: {
    width: RFPercentage(1),
    height: RFPercentage(1),
    borderRadius: RFPercentage(0.5),
    backgroundColor: Colors.grey,
    marginHorizontal: RFPercentage(0.3),
  },
  activeDot: {
    backgroundColor: Colors.white,
  },
  cardFooter: {
    marginTop: RFPercentage(2),
    width: "92%",
    alignItems: "flex-start",
  },

  // modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: Colors.ligthBlack,
    borderRadius: RFPercentage(2),
    padding: RFPercentage(2),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: RFPercentage(2),
  },
  modalTitle: {
    fontSize: RFPercentage(2.2),
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },

  categoryItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: RFPercentage(1),
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightgrey,
  },
  categoryItemText: {
    fontSize: RFPercentage(1.7),
    color: Colors.white,
    fontFamily: FontFamily.regular,
  },
});
