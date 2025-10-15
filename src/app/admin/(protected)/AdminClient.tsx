"use client";

import {
  Admin,
  Resource,
  List,
  Datagrid,
  TextField,
  BooleanField,
  DateField,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  DateTimeInput,
  DateInput,
  required,
  Show,
  SimpleShowLayout,
  EditButton,
  DeleteButton,
  NumberInput,
  SelectInput,
  ReferenceInput,
  AutocompleteInput,
  useRecordContext,
  useInput,
  useNotify,
  useRedirect,
  bwLightTheme,
  bwDarkTheme,
  Button,
} from "react-admin";
import React, { useState } from "react";
import Image from "next/image";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { api } from "~/trpc/react";
import { createDataProvider } from "./dataProvider";

const PreviewButton = () => {
  const record = useRecordContext();
  if (!record) return null;

  const handlePreview = () => {
    window.open(`/?preview=${record.id}`, "_blank");
  };

  return (
    <button
      onClick={handlePreview}
      className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
    >
      🔍 Preview Market
    </button>
  );
};

// Custom input for ConspiraInfo with metadata fetching using React Admin form hooks
const ConspiraInfoLinkInput = ({ source }: { source: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchStatus, setFetchStatus] = useState<string>("");
  const fetchMetadata = api.metadata.fetchFromUrl.useMutation();
  const notify = useNotify();

  // Access form fields using React Admin hooks
  const titleField = useInput({ source: "title" });
  const imgSrcField = useInput({ source: "imgSrc" });

  const handleBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const url = event.target.value;
    if (!url) return;

    // Validate URL
    try {
      new URL(url);
    } catch {
      setFetchStatus("Invalid URL");
      return;
    }

    setIsLoading(true);
    setFetchStatus("");

    try {
      console.log("Fetching metadata for:", url);
      const result = await fetchMetadata.mutateAsync({ url });
      console.log("Metadata result:", result);

      if (result.success) {
        let updated = false;

        // Only populate if fields are empty
        if (!titleField.field.value && result.title) {
          titleField.field.onChange(result.title);
          updated = true;
        }

        if (!imgSrcField.field.value && result.image) {
          imgSrcField.field.onChange(result.image);
          updated = true;
        }

        if (updated) {
          setFetchStatus("✓ Metadata fetched");
          notify("Metadata fetched successfully", { type: "info" });
        } else {
          setFetchStatus("No new metadata");
        }
      } else {
        setFetchStatus("Could not fetch metadata");
        console.warn("Metadata fetch failed:", result.error);
      }
    } catch (error) {
      console.error("Failed to fetch metadata:", error);
      setFetchStatus("Fetch failed");
      notify("Failed to fetch metadata. You can enter manually.", {
        type: "warning",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <TextInput
        source={source}
        fullWidth
        helperText={
          isLoading
            ? "🔄 Fetching metadata..."
            : fetchStatus
              ? fetchStatus
              : "URL to content (metadata will be fetched on blur)"
        }
        onBlur={handleBlur}
      />
    </div>
  );
};

// Image preview component that watches imgSrc field
const ImagePreview = () => {
  const imgSrcField = useInput({ source: "imgSrc" });
  const previewUrl = imgSrcField.field.value || "";

  if (!previewUrl) return null;

  return (
    <div className="mb-4 rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Image Preview
      </label>
      <Image
        key={previewUrl}
        src={previewUrl}
        alt="Image preview"
        width={400}
        height={225}
        className="rounded-lg object-cover"
        unoptimized
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
        }}
      />
    </div>
  );
};

// Video preview component that watches videoUrl field
const VideoPreview = () => {
  const videoUrlField = useInput({ source: "videoUrl" });
  const previewUrl = videoUrlField.field.value || "";

  if (!previewUrl) return null;

  return (
    <div className="mb-4 rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Video Preview
      </label>
      <video
        key={previewUrl}
        src={previewUrl}
        controls
        className="h-auto w-full max-w-2xl rounded-lg"
        onError={(e) => {
          const target = e.target as HTMLVideoElement;
          target.style.display = "none";
        }}
      >
        Your browser does not support the video tag.
      </video>
      <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
        URL: {previewUrl}
      </p>
    </div>
  );
};

// Custom image upload component that integrates with React Admin forms
const ImageUploadInput = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  // Use React Admin's useInput hook to access the form's imgSrc field
  const imgSrcField = useInput({ source: "imgSrc" });

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setUploadedUrl(data.url);

        // Properly update the React Admin form field
        imgSrcField.field.onChange(data.url);
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-4">
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Upload Image (optional - overrides fetched image)
      </label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={uploading}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={uploading}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
      >
        {uploading ? "Uploading..." : "Choose Image File"}
      </button>
      {uploadedUrl && (
        <div className="mt-2">
          <p className="text-sm text-green-600 dark:text-green-400">
            ✓ Uploaded successfully
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Path: {uploadedUrl}
          </p>
        </div>
      )}
    </div>
  );
};

// Draggable list for videos
const DraggableVideoList = ({ marketId }: { marketId: string }) => {
  const { data: videos, refetch } = api.admin.videos.list.useQuery({
    marketId,
  });
  const reorderMutation = api.admin.videos.reorder.useMutation();
  const [items, setItems] = useState(videos || []);
  const notify = useNotify();

  React.useEffect(() => {
    if (videos) {
      setItems([...videos].sort((a, b) => a.order - b.order));
    }
  }, [videos]);

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem!);

    // Update order values
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index,
    }));

    setItems(updatedItems);

    // Save to backend
    try {
      await reorderMutation.mutateAsync({
        items: updatedItems.map((item) => ({ id: item.id, order: item.order })),
      });
      await refetch();
      notify("Videos reordered successfully", { type: "success" });
    } catch (error) {
      console.error("Failed to reorder videos:", error);
      notify("Failed to reorder videos", { type: "error" });
      // Revert on error
      if (videos) setItems(videos);
    }
  };

  if (!items.length)
    return <p className="text-gray-500 dark:text-gray-400">No videos yet</p>;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="videos">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {items.map((video, index) => (
              <Draggable key={video.id} draggableId={video.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <span className="cursor-grab text-gray-400 active:cursor-grabbing dark:text-gray-500">
                      ☰
                    </span>
                    <span className="flex-1 truncate text-sm text-gray-700 dark:text-gray-300">
                      {video.videoUrl}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Order: {video.order}
                    </span>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

// Draggable list for conspiraInfo
const DraggableConspiraInfoList = ({ marketId }: { marketId: string }) => {
  const { data: infos, refetch } = api.admin.conspiraInfo.list.useQuery({
    marketId,
  });
  const reorderMutation = api.admin.conspiraInfo.reorder.useMutation();
  const [items, setItems] = useState(infos || []);
  const notify = useNotify();

  React.useEffect(() => {
    if (infos) {
      setItems([...infos].sort((a, b) => a.order - b.order));
    }
  }, [infos]);

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem!);

    // Update order values
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index,
    }));

    setItems(updatedItems);

    // Save to backend
    try {
      await reorderMutation.mutateAsync({
        items: updatedItems.map((item) => ({ id: item.id, order: item.order })),
      });
      await refetch();
      notify("Leaks reordered successfully", { type: "success" });
    } catch (error) {
      console.error("Failed to reorder conspiraInfo:", error);
      notify("Failed to reorder leaks", { type: "error" });
      // Revert on error
      if (infos) setItems(infos);
    }
  };

  if (!items.length)
    return <p className="text-gray-500 dark:text-gray-400">No leaks yet</p>;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="conspiraInfos">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {items.map((info, index) => (
              <Draggable key={info.id} draggableId={info.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <span className="cursor-grab text-gray-400 active:cursor-grabbing dark:text-gray-500">
                      ☰
                    </span>
                    <div className="flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                        {info.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {info.type} • {info.date}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Order: {info.order}
                    </span>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

function AdminApp() {
  const trpcContext = api.useContext();
  const dataProvider = createDataProvider(trpcContext.client);

  return (
    <Admin
      dataProvider={dataProvider}
      title="Conspira.fi Admin"
      theme={bwLightTheme}
      darkTheme={bwDarkTheme}
      requireAuth={false}
      disableTelemetry
    >
      <Resource
        name="markets"
        list={MarketList}
        edit={MarketEdit}
        create={MarketCreate}
        show={MarketShow}
      />
      <Resource
        name="videos"
        list={VideoList}
        edit={VideoEdit}
        create={VideoCreate}
      />
      <Resource
        name="conspiraInfos"
        list={ConspiraInfoList}
        edit={ConspiraInfoEdit}
        create={ConspiraInfoCreate}
      />
    </Admin>
  );
}

// Market Components
const MarketList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="name" />
      <TextField source="eventTitle" />
      <TextField source="marketSlug" />
      <BooleanField source="isActive" />
      <DateField source="createdAt" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

const MarketEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" validate={required()} fullWidth />
      <TextInput source="eventTitle" validate={required()} fullWidth />
      <TextInput
        source="eventDescription"
        multiline
        rows={4}
        validate={required()}
        fullWidth
        helperText="Detailed explanation of the conspiracy theory"
      />
      <TextInput
        source="marketSlug"
        validate={required()}
        fullWidth
        helperText="From PMX market URL"
      />
      <DateTimeInput
        source="marketEndTime"
        helperText="Market resolution date (UTC)"
      />
      <TextInput
        source="tweetSearchPhrase"
        validate={required()}
        fullWidth
        helperText="Twitter search term (e.g., '3I/ATLAS')"
      />
      <TextInput
        source="yesTokenMint"
        validate={required()}
        fullWidth
        helperText="Solana YES token mint address"
      />
      <TextInput
        source="noTokenMint"
        validate={required()}
        fullWidth
        helperText="Solana NO token mint address"
      />
      <TextInput source="pmxLink" fullWidth helperText="PMX market URL" />
      <TextInput source="jupiterLink" fullWidth helperText="Jupiter swap URL" />
      <BooleanInput source="isActive" helperText="Show on frontend" />
    </SimpleForm>
  </Edit>
);

const MarketCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" validate={required()} fullWidth />
      <TextInput source="eventTitle" validate={required()} fullWidth />
      <TextInput
        source="eventDescription"
        multiline
        rows={4}
        validate={required()}
        fullWidth
        helperText="Detailed explanation of the conspiracy theory"
      />
      <TextInput
        source="marketSlug"
        validate={required()}
        fullWidth
        helperText="From PMX market URL"
      />
      <DateTimeInput
        source="marketEndTime"
        helperText="Market resolution date (UTC)"
      />
      <TextInput
        source="tweetSearchPhrase"
        validate={required()}
        fullWidth
        helperText="Twitter search term (e.g., '3I/ATLAS')"
      />
      <TextInput
        source="yesTokenMint"
        validate={required()}
        fullWidth
        helperText="Solana YES token mint address"
      />
      <TextInput
        source="noTokenMint"
        validate={required()}
        fullWidth
        helperText="Solana NO token mint address"
      />
      <TextInput source="pmxLink" fullWidth helperText="PMX market URL" />
      <TextInput source="jupiterLink" fullWidth helperText="Jupiter swap URL" />
      <BooleanInput
        source="isActive"
        defaultValue={false}
        helperText="Show on frontend (keep off until ready)"
      />
    </SimpleForm>
  </Create>
);

// Client-side wrapper for drag-and-drop lists
const DragDropSection = () => {
  const record = useRecordContext();
  const redirect = useRedirect();

  if (!record?.id) return null;

  return (
    <>
      <div className="mt-8 rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Videos (Drag to Reorder)
          </h3>
          <button
            onClick={() =>
              redirect(
                "create",
                "videos",
                undefined,
                {},
                { marketId: String(record.id) },
              )
            }
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            + Add Video
          </button>
        </div>
        <DraggableVideoList marketId={String(record.id)} />
      </div>

      <div className="mt-8 rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Conspira Info / Leaks (Drag to Reorder)
          </h3>
          <button
            onClick={() =>
              redirect(
                "create",
                "conspiraInfos",
                undefined,
                {},
                { marketId: String(record.id) },
              )
            }
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            + Add Leak
          </button>
        </div>
        <DraggableConspiraInfoList marketId={String(record.id)} />
      </div>
    </>
  );
};

const MarketShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="id" label="Market ID" />
        <PreviewButton />
        <TextField source="name" />
        <TextField source="eventTitle" />
        <TextField source="eventDescription" />
        <TextField source="marketSlug" />
        <DateField source="marketEndTime" showTime />
        <TextField source="tweetSearchPhrase" />
        <TextField source="yesTokenMint" />
        <TextField source="noTokenMint" />
        <TextField source="pmxLink" />
        <TextField source="jupiterLink" />
        <BooleanField source="isActive" />
        <DateField source="createdAt" showTime />
        <DateField source="updatedAt" showTime />

        <DragDropSection />
      </SimpleShowLayout>
    </Show>
  );
};

// Video Components
const VideoList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="videoUrl" />
      <TextField source="marketId" />
      <TextField source="order" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

const VideoEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput
        source="videoUrl"
        validate={required()}
        fullWidth
        helperText="Full URL to video file"
      />
      <VideoPreview />
      <NumberInput source="order" defaultValue={0} />
    </SimpleForm>
  </Edit>
);

const VideoCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput source="marketId" reference="markets">
        <AutocompleteInput
          label="Market"
          optionText="name"
          validate={required()}
          fullWidth
          helperText="Select the market for this video"
        />
      </ReferenceInput>
      <TextInput
        source="videoUrl"
        validate={required()}
        fullWidth
        helperText="Full URL to video file"
      />
      <VideoPreview />
      <NumberInput
        source="order"
        defaultValue={0}
        helperText="Display order (0 = first)"
      />
    </SimpleForm>
  </Create>
);

// ConspiraInfo Components
const ConspiraInfoList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="type" />
      <TextField source="title" />
      <TextField source="marketId" />
      <TextField source="date" />
      <TextField source="order" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

const ConspiraInfoEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <SelectInput
          source="type"
          choices={[
            { id: "youtube", name: "YouTube" },
            { id: "article", name: "Article" },
            { id: "podcast", name: "Podcast" },
          ]}
          validate={required()}
        />
        <TextInput source="title" validate={required()} fullWidth />
        <ConspiraInfoLinkInput source="link" />
        <ImageUploadInput />
        <TextInput
          source="imgSrc"
          fullWidth
          helperText="Image URL (auto-filled from OG tags or upload)"
        />
        <ImagePreview />
        <DateInput
          source="date"
          validate={required()}
          helperText="Select date or enter MM/DD/YYYY"
        />
        <NumberInput source="order" defaultValue={0} />
      </SimpleForm>
    </Edit>
  );
};

const ConspiraInfoCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput source="marketId" reference="markets">
        <AutocompleteInput
          label="Market"
          optionText="name"
          validate={required()}
          fullWidth
          helperText="Select the market for this leak"
        />
      </ReferenceInput>
      <SelectInput
        source="type"
        choices={[
          { id: "youtube", name: "YouTube" },
          { id: "article", name: "Article" },
          { id: "podcast", name: "Podcast" },
        ]}
        validate={required()}
      />
      <ConspiraInfoLinkInput source="link" />
      <TextInput
        source="title"
        validate={required()}
        fullWidth
        helperText="Auto-filled from URL or enter manually"
      />
      <ImageUploadInput />
      <TextInput
        source="imgSrc"
        fullWidth
        helperText="Image URL (auto-filled from OG tags or upload)"
      />
      <ImagePreview />
      <DateInput
        source="date"
        validate={required()}
        defaultValue={new Date().toISOString().split("T")[0]}
        helperText="Select date or enter MM/DD/YYYY (defaults to today)"
      />
      <NumberInput
        source="order"
        defaultValue={0}
        helperText="Display order (0 = first)"
      />
    </SimpleForm>
  </Create>
);

export default AdminApp;
