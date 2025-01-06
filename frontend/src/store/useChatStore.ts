import { create, StoreApi, UseBoundStore } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { ChatStore, MessageModel } from "../types";

export const useChatStore: UseBoundStore<StoreApi<ChatStore>> = create(
    (set, get) => ({
        messages: [],
        users: [],
        selectedUser: null,
        isUsersLoading: false,
        isMessagesLoading: false,

        getUsers: async () => {
            try {
                set({ isUsersLoading: true });
                const res = await axiosInstance.get("/chat/users");
                set({ users: res.data });
            } catch (error: any) {
                toast.error(error.response.data.message);
            } finally {
                set({ isUsersLoading: false });
            }
        },

        getMessages: async (userId) => {
            try {
                set({ isMessagesLoading: true });
                const res = await axiosInstance.get(`/chat/messages/${userId}`);
                set({ messages: res.data });
            } catch (error: any) {
                toast.error(error.response.data.message);
            } finally {
                set({ isMessagesLoading: false });
            }
        },

        sendMessage: async (messageData) => {
            const { selectedUser, messages } = get();

            if (!selectedUser) return;

            try {
                const res = await axiosInstance.post(
                    `/chat/send-message`,
                    messageData
                );
                set({ messages: [...messages, res.data] });
            } catch (error: any) {
                toast.error(error.response.data.message);
            }
        },

        subscribeToMessages: () => {
            const { selectedUser } = get();

            if (!selectedUser) return;

            const socket = useAuthStore.getState().socket; // getState is the vanilla (non-Reactive) way to retrieve data

            if (!socket) return;

            socket.on("newMessage", (newMessage: MessageModel) => {
                const isMessageSentFromSelectedUser =
                    newMessage.senderId === selectedUser._id;

                if (!isMessageSentFromSelectedUser) return;

                set({ messages: [...get().messages, newMessage] });
            });
        },

        unsubscribeFromMessages: () => {
            const socket = useAuthStore.getState().socket;

            if (!socket) return;

            socket.off("newMessage");
        },

        setSelectedUser: (selectedUser) => set({ selectedUser }),
    })
);
