import apiClient from "@/api/client.js";

export async function getAuthUserData() {

    const res = await apiClient.get("/auth/user");
    return res.data;

}


export async function getActiveLinks() {

    const res = await apiClient.get("/active/links");
    return res.data;

}


export async function getClicks() {

    // profile ait linklerin toplam tıklamasını getirelim

    const res = await apiClient.get("/dashboard/total-clicks");

    return res.data;

}

export async function lastActivities() {

    const res = await apiClient.get("/dashboard/last-activities");
    return res.data;
}