import React, {
  useImperativeHandle,
  useEffect,
  useCallback,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  View,
} from "react-native";

import { useAppThemeContext } from "../../hooks/useAppTheme";
import RenderIcon from "./Icon";
import Dialog, { BottomSheetDialogRef } from "./Dialog";
import Text from "./Text";
import apiService from "../../utils/apiService";
import { commonStyles } from "../../utils/commonStyles";

interface IProps {
  trigger?: React.ReactElement;
  choices?: Choice[];
  choiceUrl?: string;
  onClose?: (arg?: any) => void;
  onSelect?: (arg?: any) => void;
  defaultValue?: string;
  title?: string;
}

const BottomSheetSelector = React.forwardRef(
  (
    {
      trigger,
      choiceUrl,
      choices = [],
      onClose,
      defaultValue = "",
      onSelect,
      title = "Select choices",
    }: IProps,
    ref,
  ) => {
    const { colors } = useAppThemeContext();
    const { width: windowWidth } = useWindowDimensions();

    const dialogRef = useRef<BottomSheetDialogRef>(null);

    const [options, setOptions] = useState(choices);
    const [choiceSelected, setChoiceSelected] = useState(defaultValue);

    useImperativeHandle(ref, () => ({
      openBottomSheet: () => {
        setChoiceSelected(defaultValue);
        dialogRef.current?.open();
      },
    }));

    const fetchChoices = useCallback(async () => {
      if (!choiceUrl) return;

      try {
        const { data } = await apiService.get(choiceUrl);
        setOptions(data);
      } catch (err) {
        console.log("error on fetch choices in async dropdown", err);
      }
    }, [choiceUrl]);

    useEffect(() => {
      fetchChoices();
    }, [fetchChoices]);

    const handleClose = () => {
      dialogRef.current?.close();

      if (onClose) {
        onClose();
      }
    };

    const manageSelected = (item: Choice) => {
      setChoiceSelected(item.label);

      if (onSelect) {
        onSelect(item);
      }
    };

    const renderChoices = ({ item, index }: any) => {
      let findindex = -1;

      if (choiceSelected?.toLowerCase() === item.label.toLowerCase()) {
        findindex = index;
      }

      return (
        <Pressable
          key={item.value}
          style={[
            commonStyles.choicesItem,
            {
              borderColor: colors.lightGrey,
              backgroundColor: colors.background,
            },
          ]}
          onPress={() => {
            manageSelected(item);
            dialogRef.current?.close();
          }}
        >
          <View style={commonStyles.choicesItemContent}>
            <Text
              numberOfLines={1}
              style={[
                commonStyles.textChoice,
                commonStyles.choiceLabel,
                findindex >= 0 ? { color: colors.primary } : {},
              ]}
            >
              {item.label}
            </Text>

            {findindex >= 0 && (
              <View style={commonStyles.choiceIconContainer}>
                <RenderIcon name="Check" size={18} color={colors.primary} />
              </View>
            )}
          </View>
        </Pressable>
      );
    };

    return (
      <>
        {trigger && (
          <Pressable
            style={{ flex: 1 }}
            onPress={() => dialogRef.current?.open()}
          >
            {trigger}
          </Pressable>
        )}

        <Dialog ref={dialogRef} snapPoints={["50%"]}>
          <>
            <View
              style={[
                styles.dialogHeaderContainer,
                {
                  backgroundColor: colors.background,
                  borderBottomColor: colors.lightGrey,
                },
              ]}
            >
              <View
                style={{
                  alignItems: "center",
                  marginBottom: 5,
                  paddingTop: 10,
                }}
              >
                <Pressable
                  onPress={handleClose}
                  style={{
                    alignItems: "center",
                    width: 80,
                    borderRadius: 10,
                    backgroundColor: colors.lightGrey,
                  }}
                >
                  <RenderIcon
                    name="ChevronDown"
                    size={20}
                    color={colors.darkestGrey}
                  />
                </Pressable>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: colors.text,
                  }}
                >
                  {title}
                </Text>
                <Pressable
                  onPress={handleClose}
                  style={[
                    styles.dialogInputButton,
                    {
                      display: "none",
                      alignItems: "center",
                      backgroundColor: colors.primary,
                    },
                  ]}
                >
                  <Text style={styles.dialogInputButtonText}>Done</Text>
                </Pressable>
              </View>
            </View>

            <FlatList
              data={options}
              renderItem={renderChoices}
              keyExtractor={(item: any) => item.value}
              style={{ marginBottom: 10 }}
              ListEmptyComponent={
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 10,
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.darkestGrey,
                    }}
                  >
                    No Choices Available
                  </Text>
                </View>
              }
            />
          </>
        </Dialog>
      </>
    );
  },
);

export default BottomSheetSelector;

const styles = StyleSheet.create({
  dialogHeaderContainer: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  actionButtons: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  dialogInputButton: {
    height: 36,
    width: 64,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  dialogInputButtonText: {
    color: "white",
    fontWeight: "600",
  },
  buttonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  text: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
});
