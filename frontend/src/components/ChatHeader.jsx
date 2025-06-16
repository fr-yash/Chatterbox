import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useChatStore } from "../store/useChatStore.js";

const ChatHeader = () => {
  const { selectedUsers, setSelectedUsers } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-4 border-b border-base-300 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="w-10 h-10 rounded-full relative">
              <img src={selectedUsers.profilepic || "/avatar.png"} alt={selectedUsers.fullname} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUsers.fullname}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUsers._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUsers(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;