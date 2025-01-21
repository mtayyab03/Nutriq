import React, { useState, useEffect } from "react";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  Modal,
  FlatList,
  ScrollView,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { db, storage } from "../../firebase"; // Assuming db is your Firestore instance
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

//Components
import Screen from "../components/Screen";
import AppButton from "../components/AppButton";
import DoubleField from "../components/DoubleField";

//config
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";

const NewPostScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [caption, setCaption] = useState("");
  const [title, setTitle] = useState("");
  const [purchase, onChangePurchase] = useState("");
  const [expiry, onChangeExpiry] = useState("");
  const [price, onChangePrice] = useState("");
  const [quatity, onChangeQuantity] = useState("");
  const [make, onChangeMake] = useState("");
  const [model, onChangeModel] = useState("");
  const [images, setImages] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaType, setMediaType] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("Category");
  const [SubCategory, setSubCategory] = useState("Sub Category");
  const [isSubCategoryModalVisible, setisSubCategoryModalVisible] =
    useState(false);
  const [isCategoryModalVisible, setisCategoryModalVisible] = useState(false);

  const categories = ["Raw Material", "Machine"];

  const subcategories = [
    "Electronic",
    "Electrical",
    "Rubber",
    "Glass",
    "Metal parts",
    "Cosumables",
    "Fabrics",
    "Leather",
    "Furiture",
    "Tiles/Stones",
    "Packaging",
    "Official Equipment",
    "Others",
  ];

  const handleCategorySelect = (item) => {
    if (!isSubCategoryModalVisible) {
      setSelectedCategory(item);
      setisCategoryModalVisible(false);
    } else {
      setSubCategory(item);
      setisSubCategoryModalVisible(false);
    }
  };

  const pickImage = async () => {
    if (images.length >= 3) {
      Alert.alert("Limit Reached", "You can upload a maximum of 3 images.");
      return;
    }

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to the media library."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages((prevImages) => [...prevImages, result.assets[0].uri]);
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!images || caption.trim() === "") {
      Alert.alert("Please add an image and write a caption.");
      return;
    }

    try {
      // Upload images to Firebase Storage and get URLs
      const imageUrls = [];

      for (let i = 0; i < images.length; i++) {
        const imageUri = images[i];
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const storageRef = ref(storage, `images/${Date.now()}.jpg`);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        // Wait for image upload to complete
        await uploadTask;

        // Get the download URL for the uploaded image
        const imageUrl = await getDownloadURL(storageRef);
        imageUrls.push(imageUrl);
      }

      // Store the data in Firestore (db in your case)
      const newPost = {
        title,
        caption,
        purchaseDate: purchase,
        expiryDate: expiry,
        price,
        quantity: quatity,
        make,
        model,
        category: selectedCategory,
        subCategory: SubCategory,
        images: imageUrls, // Store the image URLs
        timestamp: new Date(),
      };

      await addDoc(collection(db, "posts"), newPost); // Use `db` here

      // Clear the form and show success message
      setCaption("");
      setTitle("");
      onChangePurchase("");
      onChangeExpiry("");
      onChangePrice("");
      onChangeQuantity("");
      onChangeMake("");
      onChangeModel("");
      setImages([]);
      setSelectedCategory("Category");
      setSubCategory("Sub Category");

      Alert.alert("Success!", "Your post has been submitted successfully.", [
        {
          text: "OK",
          onPress: () => {
            navigation.goBack(); // Navigate back
          },
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        "There was an issue submitting your post. Please try again."
      );
    }
  };

  return (
    <Screen style={styles.screen}>
      <View
        style={{
          width: "90%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            alignItems: "center",
            position: "absolute",
            left: 0,
          }}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back-ios" color={Colors.white} size={24} />
        </TouchableOpacity>
        <View>
          <Text
            style={{
              fontSize: RFPercentage(2),
              color: Colors.lightWhite,
              fontFamily: FontFamily.semiBold,
            }}
          >
            New Post
          </Text>
        </View>
      </View>

      {/* Uploaded Images */}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: RFPercentage(5),
        }}
      >
        <View style={styles.imageContainer}>
          {images.map((imageUri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: imageUri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveImage(index)}
              >
                <FontAwesome name="times-circle" size={20} color={Colors.red} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Upload Button */}
        {images.length < 3 && (
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                padding: RFPercentage(2),
                backgroundColor: Colors.lightWhite,
                borderRadius: RFPercentage(6),
              }}
            >
              <FontAwesome
                color={Colors.ligthBlack}
                size={RFPercentage(3)}
                name="camera"
              />
            </View>
            <Text
              style={{
                marginTop: RFPercentage(1),
                fontSize: RFPercentage(1.2),
                color: Colors.lightWhite,
                fontFamily: FontFamily.semiBold,
              }}
            >
              Upload Image
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {/* images upload end */}

      <View style={{ marginTop: RFPercentage(2) }} />
      <View style={styles.emailmain}>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter title"
          placeholderTextColor={Colors.placeholder}
        />
      </View>

      {/* double modal */}
      <View
        style={{
          width: "90%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: RFPercentage(1),
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setisSubCategoryModalVisible(false); // Set to true for categories
            setisCategoryModalVisible(true);
          }}
          activeOpacity={0.7}
          style={styles.categoryButton}
        >
          <Text style={styles.categoryText}>{selectedCategory}</Text>
          <MaterialIcons
            color={Colors.white}
            size={28}
            name="keyboard-arrow-down"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setisSubCategoryModalVisible(true); // Set to true for categories
            setisCategoryModalVisible(false);
          }}
          activeOpacity={0.7}
          style={styles.categoryButton}
        >
          <Text style={styles.categoryText}>{SubCategory}</Text>
          <MaterialIcons
            color={Colors.white}
            size={28}
            name="keyboard-arrow-down"
          />
        </TouchableOpacity>
      </View>

      <DoubleField
        ftitle="Enter purchase date"
        ltitle="Enter expiry date"
        fvalue={purchase}
        lvalue={expiry}
        onChangeF={onChangePurchase}
        onChangeL={onChangeExpiry}
      />
      <DoubleField
        ftitle="Price per kg/meter"
        ltitle="Enter quantity"
        fvalue={price}
        lvalue={quatity}
        onChangeF={onChangePrice}
        onChangeL={onChangeQuantity}
      />
      <DoubleField
        ftitle="make (optional)"
        ltitle="Model no (optional)"
        fvalue={make}
        lvalue={model}
        onChangeF={onChangeMake}
        onChangeL={onChangeModel}
      />

      {/* caption write */}
      <View style={styles.description}>
        <TextInput
          style={{ color: Colors.lightWhite }}
          placeholder="Write a description"
          placeholderTextColor={Colors.placeholder}
          multiline={true}
          value={caption}
          onChangeText={setCaption} // Update state when text changes
        />
      </View>

      {/* button */}

      <TouchableOpacity
        onPress={handleSubmit}
        style={styles.loginbutton}
        activeOpacity={0.8}
      >
        <AppButton title="Submit" buttonColor={Colors.primary} />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={
          isCategoryModalVisible
            ? isCategoryModalVisible
            : isSubCategoryModalVisible
        }
        animationType="fade"
        transparent={true}
        onRequestClose={() => setisCategoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isCategoryModalVisible
                  ? "Select Category"
                  : "Select Subcategory"}
              </Text>
              <TouchableOpacity
                onPress={
                  isCategoryModalVisible
                    ? () => setisCategoryModalVisible(false)
                    : () => setisSubCategoryModalVisible(false)
                }
              >
                <MaterialIcons name="close" size={24} color={Colors.white} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <FlatList
                data={isCategoryModalVisible ? categories : subcategories}
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
    </Screen>
  );
};

export default NewPostScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.blacky,
  },
  img: {
    width: RFPercentage(9),
    height: RFPercentage(9),
    borderRadius: RFPercentage(5),
  },
  description: {
    width: "90%",
    height: RFPercentage(12),
    borderRadius: RFPercentage(1),
    backgroundColor: Colors.ligthBlack,
    paddingHorizontal: RFPercentage(1.5),
    paddingVertical: RFPercentage(1),
    marginTop: RFPercentage(1),
  },
  input: { fontFamily: FontFamily.regular, color: Colors.lightWhite },
  categoryButton: {
    width: "47%",
    height: RFPercentage(6),
    backgroundColor: Colors.ligthBlack,
    borderRadius: RFPercentage(0.7),
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  categoryText: {
    fontFamily: FontFamily.medium,
    fontSize: RFPercentage(1.5),
    color: Colors.white,
  },
  mediaPicker: {
    marginTop: RFPercentage(4),
    alignItems: "center",
    justifyContent: "center",
    width: RFPercentage(20),
    height: RFPercentage(20),
    borderWidth: RFPercentage(0.2),
    borderColor: Colors.stroke,
    backgroundColor: Colors.ligthBlack,
    borderRadius: RFPercentage(3),
  },
  media: {
    width: "100%",
    height: "100%",
    borderRadius: RFPercentage(2),
  },
  loginbutton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  emailmain: {
    width: "90%",
    height: RFPercentage(6),
    backgroundColor: Colors.ligthBlack,
    color: Colors.white,
    paddingLeft: RFPercentage(3),
    borderRadius: RFPercentage(1),
    justifyContent: "center",
    marginTop: RFPercentage(1),
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

  imageContainer: {
    flexDirection: "row",
  },
  imageWrapper: {
    marginRight: RFPercentage(2),
    position: "relative",
    width: RFPercentage(12),
    height: RFPercentage(12),
  },
  image: {
    width: RFPercentage(12),
    height: RFPercentage(12),
    borderRadius: RFPercentage(1),
  },
  removeButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: Colors.white,
    borderRadius: RFPercentage(2),
  },
  uploadButton: {
    alignItems: "center",
    justifyContent: "center",
    width: RFPercentage(12),
    height: RFPercentage(12),
    borderWidth: RFPercentage(0.2),
    borderColor: Colors.stroke,
    backgroundColor: Colors.ligthBlack,
    borderRadius: RFPercentage(1),
  },
  uploadText: {
    marginTop: RFPercentage(1),
    color: Colors.lightWhite,
    fontSize: RFPercentage(1.5),
  },
});
