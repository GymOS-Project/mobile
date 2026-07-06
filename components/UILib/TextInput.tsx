import React from "react";
import {
  StyleSheet,
  View,
  TextInput as RNTextInput,
  TextInputProps,
} from "react-native";

import { useAppThemeContext } from "../../hooks/useAppTheme";
import RenderIcon from "./Icon";

type RLTextInputProps = TextInputProps & {
  iconName?: string;
  hasError?: boolean;
};

const TextInput = React.forwardRef<RNTextInput, RLTextInputProps>(
  ({ iconName, hasError = false, style, ...restProps }, ref) => {
    const { colors } = useAppThemeContext();

    if (iconName) {
      return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RenderIcon name={iconName} size={20} color={colors.darkGrey} />

          <RNTextInput
            ref={ref}
            style={[styles.textinput, style]}
            {...restProps}
          />
        </View>
      );
    }

    return (
      <RNTextInput
        ref={ref}
        style={[
          {
            color: colors.text,
            borderColor: hasError ? colors.error : colors.darkGrey,
            borderStyle: "solid",
            borderWidth: hasError ? 2 : 1,
            borderRadius: 5,
          },
          styles.textinput,
          style,
        ]}
        placeholderTextColor={colors.darkGrey}
        {...restProps}
      />
    );
  },
);

export default TextInput;

const styles = StyleSheet.create({
  textinput: {
    paddingHorizontal: 10,
    minHeight: 50,
  },
});
