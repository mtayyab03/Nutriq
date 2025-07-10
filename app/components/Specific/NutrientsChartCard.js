// // NutrientsChartCard.tsx

// import React from "react";
// import { View, Text, StyleSheet } from "react-native";
// import {
//   StackedBarChart,
//   LineChart,
//   YAxis,
//   Grid,
// } from "react-native-svg-charts";
// import { LinearGradient } from "expo-linear-gradient";
// import * as scale from "d3-scale";
// import Colors from "../../config/Colors";

// const stackedData = [
//   { red: 4, green: 2, blue: 1, gray: 2 }, // SUN
//   { red: 5, green: 3, blue: 2, gray: 4 }, // MON
//   { red: 6, green: 4, blue: 3, gray: 4 }, // TUE
//   { red: 2, green: 1, blue: 1, gray: 1 }, // WED
//   { red: 6, green: 4, blue: 2, gray: 6 }, // THU
//   { red: 5, green: 3, blue: 2, gray: 4 }, // FRI
//   { red: 1, green: 1, blue: 0, gray: 1 }, // SAT
// ];

// const keys = ["red", "green", "blue", "gray"];
// const colors = ["#E74C3C", "#27AE60", "#2980B9", "#BDC3C7"];
// const lineData = [11, 15, 17, 10, 10, 9, 12];
// const labels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// const NutrientsChartCard = () => {
//   return (
//     <LinearGradient colors={["#326680", "#1F2A44"]} style={styles.card}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Health Tracker</Text>
//         <Text style={styles.arrow}>➔</Text>
//       </View>
//       <Text style={styles.subtitle}>Meal Lodge --- 30 days </Text>
//       <View style={styles.chartContainer}>
//         <YAxis
//           data={[0, 10, 20, 30, 40]}
//           contentInset={{ top: 10, bottom: 10 }}
//           svg={{ fontSize: 10, fill: "white" }}
//           numberOfTicks={5}
//         />
//         <View style={{ flex: 1, marginLeft: 10 }}>
//           <StackedBarChart
//             style={{ height: 200 }}
//             keys={keys}
//             colors={colors}
//             data={stackedData}
//             showGrid={false}
//             contentInset={{ top: 10, bottom: 10 }}
//             horizontal={false}
//           >
//             <Grid direction={Grid.Direction.HORIZONTAL} />
//           </StackedBarChart>

//           <LineChart
//             style={StyleSheet.absoluteFill}
//             data={lineData}
//             svg={{ stroke: "#F1C40F", strokeWidth: 2 }}
//             contentInset={{ top: 10, bottom: 10 }}
//           />
//         </View>
//       </View>
//       <View style={styles.labelsContainer}>
//         {labels.map((label, index) => (
//           <Text key={index} style={styles.dayLabel}>
//             {label}
//           </Text>
//         ))}
//       </View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     borderRadius: 20,
//     padding: 16,
//     margin: 16,
//     elevation: 4,
//     width: "90%",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     width: "100%",
//   },
//   title: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   arrow: {
//     color: "white",
//     fontSize: 18,
//   },
//   subtitle: {
//     color: "white",
//     fontSize: 14,
//     marginVertical: 12,
//   },
//   chartContainer: {
//     flexDirection: "row",
//     height: 200,
//   },
//   labelsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginTop: 10,
//   },
//   dayLabel: {
//     color: "white",
//     fontSize: 10,
//     fontFamily: "Courier",
//   },
// });

// export default NutrientsChartCard;
