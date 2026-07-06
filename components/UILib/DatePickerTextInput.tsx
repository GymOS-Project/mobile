import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInputProps,
  useWindowDimensions,
} from "react-native";
import { DateTimePicker, DateTimePickerProps } from "react-native-ui-lib";

import { useAppThemeContext } from "../../hooks/useAppTheme";
import Text from "./Text";

type RLDateTimePickerProps = TextInputProps &
  DateTimePickerProps & {
    iconName?: string;
    hasError?: boolean;
    onSelectDate?: (args?: any) => void;
    defaultValue?: string;
    keyIndex?: string;
    isTimeRequired?: boolean;
    maxDate?: Date;
    minDate?: Date;
  };

const DatePickerTextInput = ({
  keyIndex = "",
  onSelectDate,
  hasError = false,
  style,
  defaultValue,
  isTimeRequired = true,
  maxDate = undefined,
  minDate = undefined,
}: RLDateTimePickerProps) => {
  const { colors } = useAppThemeContext();
  const { width: windowWidth } = useWindowDimensions();
  const [selectedDate, setSelectedDate] = useState(defaultValue ?? new Date());
  // const [selectedTime, setSelectedTime] = useState(new Date().getTime());

  useEffect(() => {
    let newDefaultValue = defaultValue || new Date().toISOString();
    const d = new Date(newDefaultValue);
    setSelectedDate(d);
  }, [defaultValue]);

  const renderCustomInput: DateTimePickerProps["renderInput"] = ({ value }) => {
    return (
      <View
        style={{
          borderColor: hasError ? colors.error : colors.lightGrey,
          borderStyle: "solid",
          borderWidth: hasError ? 2 : 1,
          borderRadius: 5,
          marginEnd: 10,
          // flexDirection: 'row',
          justifyContent: "center",
          alignContent: "center",

          width: windowWidth / 2.25,
        }}
        key={keyIndex}
      >
        <Text
          style={[
            {
              color: value ? colors.text : colors.darkGrey,
            },
            styles.textinput,
            style,
          ]}
        >
          {value ?? ""}{" "}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <DateTimePicker
        title={keyIndex}
        mode={"date"}
        renderInput={renderCustomInput}
        dateFormat={"MMM DD, YYYY"}
        value={new Date(selectedDate)}
        onChange={(date: string) => {
          setSelectedDate(date);
          if (onSelectDate) {
            onSelectDate(date);
          }
        }}
        maximumDate={maxDate}
        minimumDate={minDate}
      />

      {isTimeRequired && (
        <DateTimePicker
          title={keyIndex}
          mode={"time"}
          timeFormat={"h:mm A"}
          placeholder={"Select a Time"}
          renderInput={renderCustomInput}
          value={new Date(selectedDate)}
          onChange={(date: string) => {
            setSelectedDate(date);
            if (onSelectDate) {
              onSelectDate(date);
            }
          }}
          dialogProps={{
            ignoreBackgroundPress: true,
            modalProps: {
              useKeyboardAvoidingView: true,
            },
          }}
        />
      )}
    </View>
  );
};

export default DatePickerTextInput;

const styles = StyleSheet.create({
  textinput: {
    padding: 10,
    justifyContent: "center",
  },
});
