import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useAppThemeContext } from "../../hooks/useAppTheme";
import { commonStyles } from "../../utils/commonStyles";
import { RenderIcon, Text } from "./index";

type AttachMoreProps = {
  onAddMorePress: () => void;
  disable?: boolean;
  hasError?: boolean;
};

const AttachMore = ({
  hasError = false,
  disable = false,
  onAddMorePress,
}: AttachMoreProps) => {
  const { colors } = useAppThemeContext();
  return (
    <Pressable
      style={{
        ...commonStyles.boxWithShadow,
        ...styles.container,
        backgroundColor: colors.background,
        borderColor: hasError ? colors.error : colors.darkestGrey,
        borderWidth: hasError ? 2 : 0,
      }}
      key={"add"}
      disabled={disable}
      onPress={() => {
        onAddMorePress();
      }}
    >
      <View
        style={[
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "transparent",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
            }}
          >
            <RenderIcon
              name={"FaUpload"}
              size={20}
              color={disable ? colors.darkestGrey : colors.primary}
            />
          </View>
          <View style={{ marginHorizontal: 10 }}>
            <Text
              style={{
                color: disable ? colors.darkestGrey : colors.primary,
              }}
            >
              {"Add more Files"}
            </Text>
            <Text
              style={{
                color: colors.darkestGrey,
                fontSize: 10,
              }}
              numberOfLines={1}
            >
              {"Max 5 Files"}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
export default AttachMore;
const styles = StyleSheet.create({
  container: {
    padding: 5,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  dataContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
});
