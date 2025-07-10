// import React from "react";
// import { View, Text, StyleSheet } from "react-native";
// import {
//   Svg,
//   Circle,
//   Defs,
//   LinearGradient as SvgGradient,
//   Stop,
// } from "react-native-svg";
// import { LinearGradient } from "expo-linear-gradient";

// // 🔵 Gradient Progress Circle
// const ProgressCircle = ({ size, strokeWidth, progress, colors, label }) => {
//   const radius = (size - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;
//   const strokeDashoffset = circumference * (1 - progress);

//   return (
//     <View style={styles.centered}>
//       <Svg width={size} height={size}>
//         <Defs>
//           <SvgGradient id={`grad-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
//             {colors.map((color, index) => (
//               <Stop
//                 key={index}
//                 offset={`${(index / (colors.length - 1)) * 100}%`}
//                 stopColor={color}
//               />
//             ))}
//           </SvgGradient>
//         </Defs>
//         <Circle
//           stroke="#333"
//           fill="none"
//           cx={size / 2}
//           cy={size / 2}
//           r={radius}
//           strokeWidth={strokeWidth}
//         />
//         <Circle
//           stroke={`url(#grad-${label})`}
//           fill="none"
//           cx={size / 2}
//           cy={size / 2}
//           r={radius}
//           strokeWidth={strokeWidth}
//           strokeDasharray={`${circumference} ${circumference}`}
//           strokeDashoffset={strokeDashoffset}
//           strokeLinecap="round"
//           rotation={-90}
//           originX={size / 2}
//           originY={size / 2}
//         />
//       </Svg>
//       <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
//       <Text style={styles.progressLabel}>{label}</Text>
//     </View>
//   );
// };

// // 🟢 Multi-Segment Progress Circle
// const MultiSegmentCircle = ({ size, strokeWidth, segments, label }) => {
//   const radius = (size - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;

//   let startOffset = 0;

//   return (
//     <View style={styles.centered}>
//       <Svg width={size} height={size}>
//         {segments.map((segment, index) => {
//           const dashLength = circumference * segment.percentage;
//           const dashOffset =
//             circumference - dashLength - circumference * startOffset;
//           startOffset += segment.percentage;

//           return (
//             <Circle
//               key={index}
//               stroke={segment.color}
//               fill="none"
//               cx={size / 2}
//               cy={size / 2}
//               r={radius}
//               strokeWidth={strokeWidth}
//               strokeDasharray={`${dashLength} ${circumference}`}
//               strokeDashoffset={dashOffset}
//               strokeLinecap="butt"
//               rotation={-90}
//               originX={size / 2}
//               originY={size / 2}
//             />
//           );
//         })}
//       </Svg>
//       <Text style={styles.progressText}>
//         {Math.round(segments.reduce((acc, s) => acc + s.percentage, 0) * 100)}%
//       </Text>
//       <Text style={styles.progressLabel}>{label}</Text>
//     </View>
//   );
// };

// // 🔁 Wrapper: Accepts props to render both circles
// const DualProgressCircles = ({
//   leftLabel,
//   leftProgress,
//   leftColors,
//   rightLabel,
//   rightSegments,
// }) => {
//   return (
//     <LinearGradient colors={["#2E3A59", "#141A2E"]} style={styles.container}>
//       <View style={styles.row}>
//         <ProgressCircle
//           size={120}
//           strokeWidth={10}
//           progress={leftProgress}
//           colors={leftColors}
//           label={leftLabel}
//         />
//         <MultiSegmentCircle
//           size={120}
//           strokeWidth={10}
//           segments={rightSegments}
//           label={rightLabel}
//         />
//       </View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: "90%",
//     borderRadius: 16,
//     padding: 20,
//     margin: 20,
//     backgroundColor: "#1A1A2E",
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//   },
//   centered: {
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   progressText: {
//     position: "absolute",
//     fontSize: 18,
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   progressLabel: {
//     marginTop: 10,
//     fontSize: 14,
//     color: "#fff",
//   },
// });

// export default DualProgressCircles;
