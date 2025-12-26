import { useMutation } from "@tanstack/react-query";
import apiClient from "@/api/client.js";

export default function usePasswordChange() {
    return useMutation({
        mutationFn: async ({ currentPassword, newPassword, confirmPassword }) => {
            const { data } = await apiClient.post(
                "/api/account/password/change",
                {
                    current_password: currentPassword,
                    new_password: newPassword,
                    new_password_confirmation: confirmPassword,
                }
            );
            return data;
        }
    });
}
