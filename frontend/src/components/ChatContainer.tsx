import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
    const { messages, getMessages, subscribeToMessages, unsubscribeFromMessages, isMessagesLoading, selectedUser } =
        useChatStore();
    const { authUser } = useAuthStore();

    const containerBody: React.MutableRefObject<HTMLDivElement | null> =
        useRef(null);

    // selectedUser will not be null because of the conditional at HomePage.tsx
    useEffect(() => {
        getMessages(selectedUser!._id);

        subscribeToMessages();

        // Clean up function
        return () => unsubscribeFromMessages();
    }, [selectedUser!._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    // Scrolling down each time a message is loaded
    useEffect(() => {
        if (containerBody.current && messages)
            containerBody.current.scrollTo({
                left: 0,
                top: containerBody.current.scrollHeight,
                behavior: "smooth",
            });
    }, [messages]);

    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />

            <div
                className="flex-1 overflow-y-auto p-4 space-y-4"
                ref={containerBody}
            >
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`chat ${
                            message.senderId === authUser!._id
                                ? "chat-end"
                                : "chat-start"
                        }`}
                    >
                        <div className=" chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img
                                    src={
                                        message.senderId === authUser!._id
                                            ? authUser!.profilePic ||
                                              "/avatar.png"
                                            : selectedUser!.profilePic ||
                                              "/avatar.png"
                                    }
                                    alt="profile pic"
                                />
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">
                                {formatMessageTime(message.createdAt)}
                            </time>
                        </div>
                        <div className="chat-bubble flex flex-col">
                            {message.image && (
                                <img
                                    src={message.image}
                                    alt="Attachment"
                                    className="sm:max-w-[200px] rounded-md mb-2"
                                />
                            )}
                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}
            </div>

            <MessageInput />
        </div>
    );
};

export default ChatContainer;
