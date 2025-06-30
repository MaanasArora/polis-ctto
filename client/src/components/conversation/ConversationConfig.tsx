import { Input, Textarea } from "@headlessui/react";
import { postApi, putApi } from "../api/base";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Conversation } from "../../app/core/dashboard";

export default function ConversationConfig({
  editItem,
}: {
  editItem?: Conversation;
}) {
  let navigate = useNavigate();

  const [conversationId, setConversationId] = useState(editItem?.id ?? "");

  const [conversationName, setConversationName] = useState(
    editItem?.name ?? ""
  );
  const [conversationDescription, setConversationDescription] = useState(
    editItem?.description ?? ""
  );

  const [updated, setUpdated] = useState(0);

  function formSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newConversationRequestBody = {
      display_unmoderated: formData.get("display-unmoderated") === "on",
      name: formData.get("name"),
      description: formData.get("description"),
    };
    if (!editItem)
      // new conversation
      postApi("/conversations", newConversationRequestBody).then((resp) => {
        setConversationId(resp.id);
      });
    else {
      // edit conversation
      putApi(`/conversations/${editItem?.id}`, newConversationRequestBody).then(
        (resp) => {
          setUpdated(Date.now());
          setConversationId(resp.id);
        }
      );
    }
    navigate("/home");
  }

  return (
    <div className="flex flex-col items-start  h-full py-4 w-[95%] max-w-3xl mx-auto">
      <h1 className="text-5xl font-bold mb-8">
        {editItem ? "Edit conversation" : "New conversation"}
      </h1>
      <form
        onSubmit={formSubmit}
        id="conversation-form"
        className="grid mx-auto md:grid-cols-2 gap-2 w-full"
      >
        <label htmlFor="name">Conversation Name</label>
        <Input
          className="border-gray-500 border-2"
          type="text"
          name="name"
          id="name"
          required
          value={conversationName}
          onChange={(event) => setConversationName(event.target.value)}
        ></Input>
        <label htmlFor="description">Conversation description</label>
        <Textarea
          className="border-gray-500 border-2"
          name="description"
          id="description"
          value={conversationDescription}
          onChange={(event) => setConversationDescription(event.target.value)}
        ></Textarea>
        {/* TODO: return unmoderated settings to checkbox */}
        <label htmlFor="display-unmoderated">
          Show unmoderated comments to participants
        </label>
        <Input
          className="border-gray-500 border-2 justify-self-start aspect-square h-6"
          type="checkbox"
          name="display-unmoderated"
          id="display-unmoderated"
        ></Input>
        <button className="border-4 border-green-500 p-2 bg-green-200 rounded-2xl">
          Submit
        </button>
      </form>
    </div>
  );
}
