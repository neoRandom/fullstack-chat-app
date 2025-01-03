import { create, StoreApi, UseBoundStore } from "zustand";
import { axiosInstance } from "../lib/axios";
import { AuthStore } from "../types";
import toast from "react-hot-toast";

export const useAuthStore: UseBoundStore<StoreApi<AuthStore>> = create(
    (set) => ({
        authUser: null,
        isSigningUp: false,
        isLoggingIn: false,
        isUpdatingProfile: false,
        isCheckingAuth: true,

        checkAuth: async () => {
            try {
                set({ isCheckingAuth: true });

                const checkResponse = await axiosInstance.get("/auth/check");
                const imageResponse = await axiosInstance.get(
                    "/auth/profile-pic"
                );

                checkResponse.data.profilePic = imageResponse.data.profilePic;

                set({ authUser: checkResponse.data });
            } catch (error: any) {
                console.log("Error in checkAuth:", error.message);
                set({ authUser: null });
            } finally {
                set({ isCheckingAuth: false });
            }
        },

        signup: async (data) => {
            try {
                set({ isSigningUp: true });

                const response = await axiosInstance.post("/auth/signup", data);

                set({ authUser: response.data });

                toast.success("Account created successfully");
            } catch (error: any) {
                toast.error(error.response.data.message);
            } finally {
                set({ isSigningUp: false });
            }
        },

        logout: async () => {
            try {
                await axiosInstance.post("/auth/logout");
                set({ authUser: null });
                toast.success("Logged out successfully");
            } catch (error: any) {
                toast.error(error.response.data.message);
            }
        },

        login: async (data) => {
            try {
                set({ isLoggingIn: true });

                const response = await axiosInstance.post("/auth/login", data);

                set({ authUser: response.data });

                toast.success("Logged In Successfully");
            } catch (error: any) {
                toast.error(error.response.data.message);
            } finally {
                set({ isLoggingIn: false });
            }
        },

        updateProfile: async (data) => {
            try {
                set({ isUpdatingProfile: true });

                const response = await axiosInstance.put(
                    "/auth/update-profile",
                    data
                );

                set({ authUser: response.data });

                toast.success("Profile updated Successfully");

                return response.data;
            } catch (error: any) {
                toast.error(error.response.data.message);
            } finally {
                set({ isUpdatingProfile: false });
            }
        },
    })
);
