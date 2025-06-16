import { useEffect, useState } from 'react';
import { useChatStore } from '../store/useChatStore.js'
import SidebarSkeleton from './skeletons/SideBarSkeleton.jsx'
import { Users } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore.js'

function SideBar() {
    const { getUsers, users, selectedUsers, setSelectedUsers, isUsersLoading } = useChatStore();
    const { onlineUsers, authUser } = useAuthStore();
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    // Filter users based on online status if showOnlineOnly is true
    const filteredUsers = showOnlineOnly
        ? users.filter((user) => onlineUsers && onlineUsers.includes(user._id))
        : users;

    // Count online users (excluding current user)
    const onlineUserCount = onlineUsers
        ? onlineUsers.filter(userId => userId !== authUser?._id).length
        : 0;

    if(isUsersLoading) return <SidebarSkeleton/>

  return (
    <div>
      <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
        <div className='border-b border-base-300 w-full p-5'>
            <div className='flex items-center gap-2'>
                <Users className = "w-6 h-6"/>
                <span className='font-medium hidden lg:block'>Contacts</span>
            </div>
            <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUserCount} online)</span>
        </div>
        </div>
        <div className='overflow-y-auto w-full py-3'>
            {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUsers(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUsers?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilepic || "/avatar.png"}
                alt={user.fullname}
                className="w-12 h-12 object-cover rounded-full"
              />
              {onlineUsers && onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 w-3 h-3 bg-green-500
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullname}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers && onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-sm text-zinc-400 mt-8 px-4">
            {showOnlineOnly ? (
              <div className="space-y-2">
                <div className="text-lg">😴</div>
                <p>No users online</p>
                <p className="text-xs">Check back later or turn off "Show online only"</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-lg">👥</div>
                <p>No users found</p>
              </div>
            )}
          </div>
        )}
        </div>
      </aside>
    </div>
  )
}

export default SideBar
