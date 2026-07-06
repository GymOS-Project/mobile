import React from "react";
import { StyleSheet, View } from "react-native";
import { Controller } from "react-hook-form";

import { useAppThemeContext } from "../../../hooks/useAppTheme";
import { FieldProps } from "../../../utils/form";
import { DropDownPicker, Text } from "../../UILib";

const FormDropDown = ({
  label,
  error,
  control,
  name,
  required,
  ...restProps
}: FieldProps) => {
  const { colors } = useAppThemeContext();

  return (
    <View>
      {Boolean(label) && (
        <Text style={[styles.label, { color: colors.darkestGrey }]}>
          {label}
          {required && (
            <Text style={{ color: colors.error, marginLeft: 3 }}>*</Text>
          )}
        </Text>
      )}

      <Controller
        control={control}
        name={name}
        render={() => (
          <DropDownPicker hasError={Boolean(error)} {...restProps} />
        )}
      />

      {Boolean(error) && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
};

export default FormDropDown;

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 3,
  },
  error: {
    fontSize: 12,
    marginTop: 3,
  },
});
