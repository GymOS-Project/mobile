import { Platform, StyleSheet } from "react-native";

export const commonStyles = StyleSheet.create({
  boxWithShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Platform.OS === "ios" ? 0.5 : 0.7,
    shadowRadius: 2,
    elevation: 4,
  },
  checkListScrollContainer: {
    flex: 1,
    position: "relative",
    justifyContent: "flex-end",
    backgroundColor: "rgba(206,201,201,0.65)",
    marginBottom: 0,
  },
  scrollViewContainer: {
    position: "relative",
    paddingBottom: 50,
  },
  checkListScrollViewContainer: {
    position: "relative",
  },
  safeAreaStyle: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  screenHorizontalPadding: {
    paddingHorizontal: 16,
  },
  cardBorderRadius: {
    borderRadius: 8,
  },
  floatButtonWrapper: {
    position: "absolute",
    bottom: 20,
    right: 25,
  },
  floatButton: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  formInputs: {
    paddingVertical: 16,
    borderRadius: 10,
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#000",
    opacity: 0.57,
    zIndex: 1,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  choicesItem: {
    borderRadius: 8,
    borderBottomWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 20,
    // marginTop: 8,
  },
  choicesItemContent: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  textChoice: {
    fontSize: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  choiceLabel: {
    fontSize: 13,
    marginLeft: 8,
  },
  choiceIconContainer: {
    marginRight: 16,
  },
  uploadStatusIcon: {
    position: "absolute",
    top: 4,
    right: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  checkListFormBtnContainer: {
    position: "absolute",
    // top: '65%',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
  },
});
