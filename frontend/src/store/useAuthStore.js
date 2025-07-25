import {create} from 'zustand'
import {instance} from '../utils/axios.js'
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =  import.meta.env.MODE==='development' ? "http://localhost:3000" : "/";

export const useAuthStore = create((set,get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,
    
    checkAuth : async() =>{
        try {
            const res = await instance.get("/auth/check-auth");
            set({authUser: res.data});
            get().connectSocket();
        } catch (error) {
            set({authUser: null});
        }finally{
            set({isCheckingAuth: false});
        }
    },

    signup: async(data)=>{
        set({isSigningUp: true});
        try {
            const res = await instance.post("/auth/signup", data);
            set({authUser: res.data});
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isSigningUp: false});
        }
    },

    logout : async() =>{
        try {
            await instance.post("/auth/logout");
            set({authUser: null});
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    login: async(data)=>{
        set({isLoggingIn: true});
        try {
            const res = await instance.post("/auth/login", data);
            set({authUser: res.data});
            toast.success("Logged in successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingIn: false});
        }
    },
    updateProfile: async(data)=>{
        set({isUpdatingProfile: true});
        try {
            const res = await instance.put("/auth/update-profile", data);
            set({authUser: res.data});
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isUpdatingProfile: false});
        }
    },
    connectSocket: () =>{
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL,{
            query: {
                userId: authUser._id,
            },
        });
        socket.connect(); 
        set({socket : socket});
        socket.on("getOnlineUsers", (users) => {
            set({onlineUsers: users});
        });
    }, 
    disconnectSocket: () =>{
        if(get().socket?.connected){
            get().socket.disconnect();
        }
    },
}))
