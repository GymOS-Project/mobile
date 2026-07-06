import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import * as ExpoDocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

import { isArray } from "lodash";

import { useAppThemeContext } from "../../hooks/useAppTheme";

import { Dialog, RenderIcon, Text } from "./index";
import { ImageView, Attachment, AttachMore } from "./index";

type DocumentPickerProps = {
  openPicker?: boolean;
  multiple?: boolean;
  type?: string[];
  customContainerStyle?: any;
  initialPics?: any;
  isTypeAttachments?: boolean;
  maxFiles?: number;
  cameraPickAction?: boolean;
  setSelectedImages?: (files?: any[]) => void;
  hasError?: boolean;
  onError?: (msg?: string) => void;
  onCancel?: () => void;
  maxFileSize?: number;
  required?: boolean;
};

const DocumentPicker = ({
  openPicker,
  multiple = false,
  type = ["*/*"],
  customContainerStyle,
  initialPics,
  isTypeAttachments = false,
  maxFiles = 1,
  cameraPickAction = false,
  setSelectedImages,
  hasError = false,
  onError,
  onCancel,
  maxFileSize = 10,
  required,
}: DocumentPickerProps) => {
  const { colors } = useAppThemeContext();

  const [pickDoc, setPickDoc] = useState<any[]>([]);
  const [actionVisible, setActionVisible] = useState(false);

  useEffect(() => {
    if (initialPics) {
      if (isArray(initialPics)) {
        setPickDoc(initialPics);
      } else {
        setPickDoc([initialPics]);
      }
    }
  }, []);

  useEffect(() => {
    if (openPicker) {
      pickDocument();
    }
  }, [openPicker]);

  useEffect(() => {
    if (!required || pickDoc.length) {
      onError?.("");
    }

    if (pickDoc.length > maxFiles) {
      onError?.(`Maximum ${maxFiles} files are allowed`);
    }
  }, [pickDoc]);

  const addFiles = (files: any[]) => {
    const updatedFiles = [...pickDoc, ...files];

    setPickDoc(updatedFiles);
    setSelectedImages?.(updatedFiles);

    if (updatedFiles.length > maxFiles) {
      onError?.(`Maximum ${maxFiles} files are allowed`);
      return;
    }

    onError?.("");
  };

  const pickDocument = async () => {
    try {
      const result = await ExpoDocumentPicker.getDocumentAsync({
        type,
        multiple: multiple || maxFiles > 1,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        onCancel?.();
        return;
      }

      const files = result.assets.map((asset) => ({
        id: `${Date.now()}-${Math.random()}`,
        name: asset.name,
        uri: asset.uri,
        path: asset.uri,
        thumb_url: asset.uri,
        size: asset.size,
        mimeType: asset.mimeType,
        type: asset.mimeType,
      }));

      addFiles(files);
    } catch (error) {
      console.log("Document Picker Error:", error);
      onCancel?.();
    }
  };

  const pickCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        onError?.("Camera permission denied");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (result.canceled) {
        onCancel?.();
        return;
      }

      const files = result.assets.map((asset) => ({
        id: `${Date.now()}-${Math.random()}`,
        name: asset.fileName || `photo-${Date.now()}.jpg`,
        uri: asset.uri,
        path: asset.uri,
        thumb_url: asset.uri,
        size: asset.fileSize,
        mimeType: asset.mimeType,
        type: asset.mimeType,
      }));

      addFiles(files);
    } catch (error) {
      console.log(error);
    }
  };

  const pickFromLibrary = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        onError?.("Gallery permission denied");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: maxFiles > 1,
        quality: 1,
        selectionLimit: maxFiles,
      });

      if (result.canceled) {
        onCancel?.();
        return;
      }

      const files = result.assets.map((asset) => ({
        id: `${Date.now()}-${Math.random()}`,
        name: asset.fileName || `image-${Date.now()}.jpg`,
        uri: asset.uri,
        path: asset.uri,
        thumb_url: asset.uri,
        size: asset.fileSize,
        mimeType: asset.mimeType,
        type: asset.mimeType,
      }));

      addFiles(files);
    } catch (error) {
      console.log(error);
    }
  };

  const onItemDeletePress = (index: number) => {
    const updated = [...pickDoc];
    updated.splice(index, 1);

    setPickDoc(updated);
    setSelectedImages?.(updated);

    if (!required || updated.length) {
      onError?.("");
    }
  };

  const handleSelection = async (action: "camera" | "gallery" | "document") => {
    setActionVisible(false);

    switch (action) {
      case "camera":
        await pickCamera();
        break;

      case "gallery":
        await pickFromLibrary();
        break;

      case "document":
        await pickDocument();
        break;
    }
  };

  const renderActionDialog = () => (
    <Dialog
      visible={actionVisible}
      bottom
      height="35%"
      onDismiss={() => setActionVisible(false)}
      containerStyle={{
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: colors.background,
      }}
    >
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => handleSelection("camera")}
      >
        <RenderIcon name="Camera" size={22} color={colors.primary} />
        <Text style={styles.actionText}>Take Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => handleSelection("gallery")}
      >
        <RenderIcon name="Images" size={22} color={colors.primary} />
        <Text style={styles.actionText}>Select From Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => handleSelection("document")}
      >
        <RenderIcon name="Plus" size={40} color={colors.primary} />
        <Text style={styles.actionText}>Browse Documents</Text>
      </TouchableOpacity>
    </Dialog>
  );

  return (
    <>
      {pickDoc.length && !isTypeAttachments ? (
        <View style={[styles.container, customContainerStyle]}>
          {pickDoc.map((doc, index) => (
            <ImageView
              key={index}
              viewStyle={{
                height: 120,
                width: 120,
                backgroundColor: colors.background,
                borderWidth: 1,
                borderColor: colors.darkestGrey,
              }}
              url={doc?.uri || doc?.thumb_url}
              fallbackUrl={doc?.uri}
              onDelete={() => onItemDeletePress(index)}
            />
          ))}
        </View>
      ) : pickDoc.length && isTypeAttachments ? (
        <View style={[styles.attachContainer, customContainerStyle]}>
          <AttachMore
            disable={pickDoc.length >= maxFiles}
            hasError={hasError}
            onAddMorePress={() => {
              if (cameraPickAction) {
                setActionVisible(true);
              } else {
                pickDocument();
              }
            }}
          />

          {pickDoc.map((doc, index) => (
            <Attachment
              key={index}
              doc={doc}
              onDelete={() => onItemDeletePress(index)}
            />
          ))}
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.container,
            customContainerStyle,
            {
              borderColor: hasError ? colors.error : colors.darkGrey,
              borderWidth: hasError ? 2 : 1,
            },
          ]}
          onPress={() => {
            if (cameraPickAction) {
              setActionVisible(true);
            } else {
              pickDocument();
            }
          }}
        >
          <Plus size={40} color={colors.primary} />

          <Text
            style={{
              marginTop: 10,
            }}
          >
            Upload
          </Text>
        </TouchableOpacity>
      )}

      {renderActionDialog()}
    </>
  );
};

export default DocumentPicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },

  attachContainer: {
    flex: 1,
    paddingVertical: 10,
  },

  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  actionText: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: "500",
  },
});
