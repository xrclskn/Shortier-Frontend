import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import apiClient from "@/api/client";

export default function EmailVerifyPage() {
    const nav = useNavigate();
    const { id, hash } = useParams();
    const [q] = useSearchParams();
    const expires = q.get("expires");
    const signature = q.get("signature");

    useEffect(() => {
        if (!id || !hash || !expires || !signature) {
            nav("/app/login?verify=bad_link");
            return;
        }

        // DİKKAT: endpoint artık /api/email/verify/...
        apiClient.get(`/api/email/verify/${id}/${hash}`, {
            params: { expires, signature },
            headers: { Accept: "application/json" }, // 204/JSON bekliyoruz
        })
            .then(() => nav("/app/account?verified=1"))
            .catch((err) => {
                const s = err?.response?.status;
                if (s === 409) nav("/app/account?verified=already");
                else if (s === 403) nav("/app/login?verify=invalid");
                else if (s === 401) nav("/app/login?verify=auth_required");
                else if (s === 419) nav("/app/login?verify=expired");
                else nav("/app/login?verify=failed");
            });
    }, [id, hash, expires, signature]);

    return (
        <div className="p-10 text-center text-gray-700">
            E-posta doğrulanıyor…
        </div>
    );
}
