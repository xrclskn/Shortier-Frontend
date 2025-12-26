import {useMutation} from "@tanstack/react-query";
import apiClient from "@/api/client.js";

export default function useDeleteAccount() {
    return useMutation({
        mutationFn: async ({ password, reason }) => {
            const { data } = await apiClient.delete("/api/account/delete", {
                data: { password, reason }
            });
            return data;
        }
    });
}