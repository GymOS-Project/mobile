import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  useWindowDimensions,
  TextInput,
  FlatList,
  Pressable,
  ViewStyle,
} from "react-native";

import { useAppThemeContext } from "../../hooks/useAppTheme";
import RenderIcon from "./Icon";
import Text from "./Text";
import Dialog from "./Dialog";

export type DropDownProps = {
  options?: Choice[];
  initialValue?: ChoiceInit;
  removeSelectedItem?: boolean;
  onSelect?: (arg: any) => void;
  setRemoveSelectedItem?: (action: any) => void;
  onClear?: () => void;
  dialogTitle?: string;
  placeholder?: string;
  mode?: "SINGLE" | "MULTI";
  creatable?: boolean;
  clearable?: boolean;
  creatableInputPlaceholder?: string;
  hasError?: boolean;
  dialogHeight?: string;
  isLoading?: boolean;
  containerStyles?: ViewStyle;
  onContainerPress?: () => boolean;
};

const DropDown = ({
  options = [],
  initialValue,
  onSelect,
  dialogTitle = "",
  placeholder = "",
  mode = "SINGLE",
  creatable = false,
  clearable = false,
  creatableInputPlaceholder = "Add Item",
  hasError = false,
  dialogHeight = "60%",
  containerStyles = {},
  onContainerPress,
  onClear,
  removeSelectedItem = false,
  setRemoveSelectedItem,
  ...restProps
}: DropDownProps) => {
  const { width } = useWindowDimensions();
  const { colors } = useAppThemeContext();

  const [searchText, setSearchText] = useState("");
  const [visible, setVisible] = useState(false);
  const [choices, setChoices] = useState(options);
  const [filterChoices, setFilterChoices] = useState(options);
  const [newSelected, setNewSelected] = useState([]);

  useEffect(() => {
    setChoices(options);
    setFilterChoices(options);
    setNewSelected([]);
    if (Array.isArray(initialValue)) {
      const newArray = options.filter((option) => {
        // @ts-ignore
        return initialValue?.includes(option?.value);
      });
      // @ts-ignore
      setNewSelected(newArray);
    } else {
      const newArray = options.filter((option) => {
        return option?.value === initialValue;
      });
      // @ts-ignore
      setNewSelected(newArray);
    }
  }, [options]);

  useEffect(() => {
    if (removeSelectedItem) {
      const newArray = options.filter((option) => {
        // @ts-ignore
        return initialValue?.includes(option?.value);
      });
      // @ts-ignore
      setNewSelected(newArray);
      if (setRemoveSelectedItem) {
        setRemoveSelectedItem(false);
      }
    }
  }, [removeSelectedItem]);

  useEffect(() => {
    const searchChoice = choices.filter((option) => {
      return option?.label?.toLowerCase().includes(searchText.toLowerCase());
    });
    setFilterChoices(searchChoice);
  }, [searchText]);

  const createItem = () => {
    const alreadyExists = choices.some(
      (option) => option?.label.toLowerCase() === searchText.toLowerCase(),
    );
    if (searchText.length > 0 && !alreadyExists) {
      let newItem = { value: searchText, label: searchText };
      let newItems = [newItem, ...choices];
      setChoices(newItems);
      manageSelected(newItem);
    }
  };

  const manageSelected = (item = {}, indexFind = -1) => {
    let selected: any[] = newSelected;

    if (mode === "MULTI") {
      if (indexFind >= 0) {
        selected.splice(indexFind, 1);
      } else {
        selected.push(item);
      }
      // @ts-ignore
      setNewSelected(selected);
      if (onSelect) {
        onSelect(selected);
      }
    } else {
      selected = [];
      selected[0] = item;
      // @ts-ignore
      setNewSelected(selected);
      if (onSelect) {
        onSelect(selected[0]);
      }
      setVisible(false);
    }
  };

  const renderChoices = ({ item }: any) => {
    let selected: any[] = newSelected;

    const findindex = selected.findIndex((items) => {
      return items.value === item?.value;
    });

    return (
      <Pressable
        key={item.value}
        style={[
          styles.choicesItem,
          {
            borderColor: colors.lightGrey,
            backgroundColor: colors.background,
          },
        ]}
        onPress={() => {
          manageSelected(item, findindex);
        }}
        {...restProps}
      >
        <View style={styles.choicesItemContent}>
          <Text
            numberOfLines={1}
            style={[
              styles.textLeadStatus,
              styles.leadStatusLabel,
              findindex >= 0
                ? { color: colors.primary, fontWeight: "600" }
                : { color: colors.text, fontWeight: "500" },
            ]}
          >
            {item.label}
          </Text>
          {findindex >= 0 && (
            <View style={styles.leadStatusIconContainer}>
              <RenderIcon name={"MdCheck"} size={18} color={colors.primary} />
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  const selectedLabel =
    newSelected
      ?.map((item: any) => {
        return item?.label;
      })
      .join(", ") ?? "";

  return (
    <>
      <Pressable
        style={[
          styles.dropDownNewContainer,
          {
            borderColor: hasError ? colors.error : colors.darkGrey,
            borderStyle: "solid",
            borderWidth: hasError ? 2 : 1,
            borderRadius: 5,
            justifyContent: "center",
          },
          containerStyles,
        ]}
        onPress={() => {
          if (onContainerPress) {
            const checkRenderDropdown = onContainerPress();
            if (checkRenderDropdown) {
              setVisible(true);
            }
          } else {
            setVisible(true);
          }
          setSearchText("");
        }}
      >
        <Text style={{ color: selectedLabel ? colors.text : colors.darkGrey }}>
          {selectedLabel !== "" ? selectedLabel : placeholder}
        </Text>
        {clearable && !!selectedLabel && (
          <Pressable
            style={{ position: "absolute", right: 8 }}
            onPress={() => {
              setNewSelected([]);
              if (onClear) {
                onClear();
              }
            }}
          >
            <RenderIcon name="MdClose" size={24} color={colors.darkestGrey} />
          </Pressable>
        )}
      </Pressable>

      {visible && (
        <Dialog
          visible={visible}
          onDismiss={() => {
            setSearchText("");
            setVisible(false);
          }}
          width={width}
          height={dialogHeight}
          bottom={true}
          containerStyle={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
          renderPannableHeader={() => (
            <View
              style={[
                styles.dialogHeaderContainer,
                { borderBottomColor: colors.lightGrey },
              ]}
            >
              <View style={styles.dialogHeader}>
                <Text
                  style={[
                    styles.dialogTitle,
                    { flexGrow: 1, color: colors.text },
                  ]}
                >
                  {dialogTitle}
                </Text>
                {/* {mode === 'MULTI' && ( */}
                <Pressable
                  onPress={() => {
                    setVisible(false);
                    // onDone();
                  }}
                  style={[
                    styles.dialogInputButton,
                    {
                      alignItems: "center",
                      backgroundColor: colors.primary,
                    },
                  ]}
                >
                  <Text style={styles.dialogInputButtonText}>Done</Text>
                </Pressable>
                {/* )} */}
                {/* <Pressable
                  style={styles.dialogCloseButton}
                  onPress={() => {
                    setVisible(false);
                  }}
                >
                  <RenderIcon
                    name="MdClose"
                    size={24}
                    color={colors.darkestGrey}
                  />
                </Pressable> */}
              </View>

              {(creatable || options.length > 5) && (
                <View style={styles.dialogInputContainer}>
                  <TextInput
                    onChangeText={(val) => setSearchText(val)}
                    value={searchText}
                    placeholder={
                      creatable ? creatableInputPlaceholder : "Search Item"
                    }
                    style={[
                      styles.dialogInput,
                      {
                        color: colors.text,
                        borderColor: colors.darkestGrey,
                      },
                    ]}
                  />
                  {creatable && (
                    <Pressable
                      onPress={() => {
                        createItem();
                      }}
                      style={[
                        styles.dialogInputButton,
                        { backgroundColor: colors.primary },
                      ]}
                    >
                      <Text style={styles.dialogInputButtonText}>Add</Text>
                    </Pressable>
                  )}
                </View>
              )}
            </View>
          )}
        >
          {options.length === 0 ? (
            <View
              style={{ flex: 1, alignItems: "center", paddingVertical: 16 }}
            >
              <Text>No Choices Available</Text>
            </View>
          ) : (
            <FlatList
              data={filterChoices}
              renderItem={renderChoices}
              contentContainerStyle={styles.contentContainerStyle}
              keyExtractor={(item: any) => item.value}
              style={{ marginBottom: 10 }}
            />
          )}
        </Dialog>
      )}
    </>
  );
};

export default DropDown;

const styles = StyleSheet.create({
  dialogScrollView: {
    flexGrow: 1,
  },
  dropDownNewContainer: {
    borderWidth: 1,
    borderRadius: 3,
    fontSize: 14,
    minHeight: 50,
    paddingLeft: 12,
  },
  dialogHeaderContainer: {
    flexDirection: "column",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderWidth: 0,
  },
  dialogHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  dialogTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  dialogCloseButton: {
    alignItems: "flex-end",
    marginLeft: 20,
  },
  pickerItem: {
    fontSize: 14,
  },
  dialogHeaderInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  dialogInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  dialogInput: {
    height: 48,
    borderRadius: 8,
    padding: 8,
    flexGrow: 1,
    marginRight: 16,
    borderWidth: 1,
  },
  dialogInputButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  dialogInputButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  loader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  text: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  leadStatusContainer: {
    flex: 1,
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
  textLeadStatus: {
    fontSize: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  leadStatusLabel: {
    fontSize: 13,
    marginLeft: 8,
  },
  leadStatusIconContainer: {
    marginRight: 16,
  },
  contentContainerStyle: {
    // marginHorizontal: 10,
    // paddingTop: 8,
  },
});
