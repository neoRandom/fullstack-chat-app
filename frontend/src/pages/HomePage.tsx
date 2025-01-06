import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
    const { selectedUser } = useChatStore();

    return (
        <div className="flex-1 w-full bg-base-200 overflow-hidden flex items-center justify-center p-4 lg:p-12">
            <div className=" bg-base-100 overflow-hidden rounded-lg shadow-cl w-full h-full">
                <div className="flex rounded-lg overflow-hidden h-full">
                    <Sidebar />

                    {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
                </div>
            </div>
        </div>
    );
};
export default HomePage;
