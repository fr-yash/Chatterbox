import {create} from 'zustand'
import {toast} from 'react-hot-toast'
import {instance} from '../utils/axios.js'
import { useAuthStore } from './useAuthStore.js'

export const useChatStore = create((set,get)=>({
   messages : [],
   users: [],
   selectedUsers: null,
   isUsersLoading: false,
   isMessageLoading: false,

   getUsers: async()=>{
    set({isUsersLoading: true});
    try {
        const res = await instance.get("/message/users");
        set({users: res.data});
    } catch (error) {
        toast.error(error.response.data.message);
    }finally{
        set({isUsersLoading: false});
    }
   },

   getMessages: async(userId)=>{
    set({isMessageLoading: true});
    try {
        const res = await instance.get(`/message/${userId}`);
        set({messages: res.data});
    } catch (error) {
        toast.error(error.response.data.message);
    }finally{
        set({isMessageLoading: false});
    }
   },

   sendMessage: async(message)=>{
    const {selectedUsers , messages} = get();
    try{
        const res = await instance.post(`/message/send/${selectedUsers._id}`, message);
        set({messages: [...messages, res.data]});
    }catch(error){
        toast.error(error.response.data.message);
    }
   },

   subscribeToMessages: () =>{
    const {selectedUsers} = get();
    if(!selectedUsers) return;

    const socket = useAuthStore.getState().socket;
    if(!socket) return;

    socket.on("newMessage", (message) => {
        if(message.senderId !== selectedUsers._id) return;
        set({messages: [...get().messages, message]});
    });
   },

   unsubscribeFromMessages: () =>{
    const socket = useAuthStore.getState().socket;
    if(!socket) return;
    socket.off("newMessage");
   },

   setSelectedUsers: (user) =>{
    set({selectedUsers: user});
   },
}))
