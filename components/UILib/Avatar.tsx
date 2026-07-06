import React from "react";
import { View, StyleSheet } from "react-native";

import { useAppThemeContext } from "../../hooks/useAppTheme";
import Text from "./Text";
import { upperCase } from "lodash";

interface EmptyProps {
  name?: string;
  containerStyle?: object;
  AvatarTextStyle?: object;
}

const Avatar = ({ name, containerStyle, AvatarTextStyle }: EmptyProps) => {
  const { colors } = useAppThemeContext();
  const userName = name?.split(" ") ?? "";
  let firstName = userName ? userName[0][0] : "";
  if (userName?.length > 1) {
    firstName = userName[1][0]
      ? firstName + userName[1][0]
      : firstName + userName[0][1];
  } else {
    firstName = userName?.[0]?.[1]
      ? firstName + userName[0][1]
      : firstName + "";
  }
  return (
    <View
      style={[
        styles.topSubContainer,

        {
          backgroundColor: colors.primary,
          borderWidth: 1,
          borderColor: colors.lightGrey,
          borderRadius: 6,
          ...containerStyle,
        },
      ]}
    >
      <Text
        style={[{ color: colors.background }, styles.picText, AvatarTextStyle]}
      >{`${upperCase(firstName || "") || firstName}`}</Text>
    </View>
  );
};
export default Avatar;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginRight: 12,
    marginLeft: 10,
  },
  picText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  topSubContainer: {
    width: 80,
    height: 80,
    // borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
