
import { useDispatch } from "react-redux";
import { initializeSocketConnection } from "../service/chat.socket";
import {
  sendMessage,
  getChats,
  getMessages,
} from "../service/chat.api";

import {
  setChats,
  setCurrentChatId,
  setError,
  setLoading,
  createNewChat,
  addNewMessage,
  addMessages,
} from "../chat.slice";

export const useChat = () => {
  const dispatch = useDispatch();

  async function handleSendMessage({ message, chatId }) {
    try {
      dispatch(setError(null));
      dispatch(setLoading(true));

      const data = await sendMessage({ message, chatId });
      const { chat, aiMessage } = data;

      if (!chat?._id || !aiMessage?.content) {
        throw new Error("Invalid response received from chat API");
      }

      const activeChatId = chat._id;

      if (!chatId) {
        dispatch(
          createNewChat({
            chatId: activeChatId,
            title: chat.title || message.slice(0, 40),
          })
        );
      }

      dispatch(
        addNewMessage({
          chatId: activeChatId,
          content: message,
          role: "user",
        })
      );

      dispatch(
        addNewMessage({
          chatId: activeChatId,
          content: aiMessage.content,
          role: aiMessage.role || "assistant",
        })
      );

      dispatch(setCurrentChatId(activeChatId));

      return data;
    } catch (error) {
      console.error(
        "Send message error:",
        error.response?.data || error.message
      );

      dispatch(
        setError(
          error.response?.data?.message ||
            error.message ||
            "Message send nahi ho paya. Please try again."
        )
      );

      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetChats() {
    try {
      dispatch(setError(null));
      dispatch(setLoading(true));

      const data = await getChats();
      const { chats } = data;

      dispatch(
        setChats(
          chats.reduce((acc, chat) => {
            acc[chat._id] = {
              id: chat._id,
              title: chat.title,
              messages: [],
              lastUpdated: chat.updatedAt,
            };

            return acc;
          }, {})
        )
      );

      return chats;
    } catch (error) {
      console.error(
        "Get chats error:",
        error.response?.data || error.message
      );

      dispatch(
        setError(
          error.response?.data?.message ||
            "Chat history load nahi hui."
        )
      );

      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleOpenChat(chatId, chats) {
    try {
      dispatch(setError(null));

      const selectedChat = chats[chatId];

      if (!selectedChat) {
        throw new Error("Chat not found");
      }

      if (selectedChat.messages.length === 0) {
        dispatch(setLoading(true));

        const data = await getMessages(chatId);

        const formattedMessages = data.messages.map((msg) => ({
          content: msg.content,
          role: msg.role,
        }));

        dispatch(
          addMessages({
            chatId,
            messages: formattedMessages,
          })
        );
      }

      dispatch(setCurrentChatId(chatId));
    } catch (error) {
      console.error(
        "Open chat error:",
        error.response?.data || error.message
      );

      dispatch(
        setError(
          error.response?.data?.message ||
            "Chat open nahi ho payi."
        )
      );

      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
  };
};
