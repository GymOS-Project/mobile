import React from "react";

import { StyleSheet, Pressable, View } from "react-native";
import { commonStyles } from "../../utils/commonStyles";
import { ImageView, Text, RenderIcon } from "./index";
import { useAppThemeContext } from "../../hooks/useAppTheme";
import { getMBFromBytes } from "../../utils/common";
import useError from "../../hooks/useError";

type AttachmentProps = {
  doc?: any;
  onDelete: () => void;
};

const Attachment = ({ doc, onDelete }: AttachmentProps) => {
  const { colors } = useAppThemeContext();
  const { handleError } = useError();
  return (
    <View
      style={{
        ...commonStyles.boxWithShadow,
        ...styles.container,
        backgroundColor: colors.background,
      }}
    >
      <View
        style={[
          {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            padding: 5,
          },
        ]}
      >
        <View
          style={{
            ...styles.dataContainer,
            backgroundColor: colors.background,
          }}
        >
          <View>
            <ImageView
              viewStyle={{
                height: 32,
                width: 30,
                backgroundColor: colors.background,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: colors.darkestGrey,
              }}
              containerViewStyle={{ flex: 1 }}
              resizeMode={"cover"}
              url={doc?.thumb_url || doc?.pdf_thumb_uri || doc?.uri}
              fallbackUrl={doc?.uri}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                flex: 1,
                marginHorizontal: 10,
              }}
              numberOfLines={1}
            >
              {doc?.name ?? ""}
            </Text>
            <Text
              style={{
                flex: 1,
                marginHorizontal: 10,
                fontSize: 13,
                color: colors.darkestGrey,
              }}
              numberOfLines={1}
            >
              {getMBFromBytes(doc?.extra?.size ?? 0) ?? ""}
              {"MB"}
            </Text>
          </View>
        </View>
        {doc.hasOwnProperty("error") && doc?.error !== "" && (
          <Pressable
            style={[{ borderRadius: 10 }]}
            onPress={() => {
              handleError(doc?.error ?? "Something went wrong");
            }}
          >
            <RenderIcon
              name={"MdErrorOutline"}
              size={20}
              color={colors.error}
            />
          </Pressable>
        )}
        <Pressable
          style={[{ borderRadius: 10 }]}
          onPress={() => {
            onDelete();
          }}
        >
          <RenderIcon name={"MdClose"} size={25} color={colors.darkestGrey} />
        </Pressable>
      </View>
    </View>
  );
};
export default Attachment;
const styles = StyleSheet.create({
  container: {
    padding: 5,
    // flex:1,
    alignItems: "center",
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
