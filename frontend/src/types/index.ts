import { Socket } from "socket.io-client";

type UserModel = {
    _id: string;
    email: string;
    fullName: string;
    profilePic: string;
    createdAt: string;
    updatedAt: string;
};

type MessageModel = {
    _id: string;
    senderId: string;
    receiverId: string;
    text: string | null;
    image: string | null;
    createdAt: string;
    updatedAt: string;
};

type SignUpForm = {
    fullName: string;
    email: string;
    password: string;
};

type LoginForm = {
    email: string;
    password: string;
};

type AuthStore = {
    authUser: UserModel | null;
    isSigningUp: boolean;
    isLoggingIn: boolean;
    isUpdatingProfile: boolean;
    isCheckingAuth: boolean;
    onlineUsers: Array<string>;
    socket: null | Socket;

    checkAuth: () => Promise<void>;

    signup: (data: SignUpForm) => Promise<void>;

    logout: () => Promise<void>;

    login: (data: LoginForm) => Promise<void>;

    updateProfile: (data: FormData) => Promise<void | any>;

    connectSocket: () => void;

    disconnectSocket: () => void;
};

type ThemeStore = {
    theme: string;

    setTheme: (theme?: string) => void;
};

type ChatStore = {
    messages: Array<MessageModel>;
    users: Array<UserModel>;
    selectedUser: null | UserModel;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;

    getUsers: () => Promise<void>;

    getMessages: (userId: string) => Promise<void>;

    sendMessage: (messageData: FormData) => Promise<void>;

    subscribeToMessages: () => void;

    unsubscribeFromMessages: () => void;

    setSelectedUser: (selectedUser: UserModel | null) => void;
};

type AuthImagePatternParams = {
    title: string;
    subtitle: string;
};

export type {
    UserModel,
    MessageModel,
    SignUpForm,
    LoginForm,
    AuthStore,
    ThemeStore,
    ChatStore,
    AuthImagePatternParams,
};
