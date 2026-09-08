import { ContactMessage } from "@/app/types/types";

export const getContactMessages = async (
  accessToken: string,
): Promise<ContactMessage[]> => {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";
  try {
    const response = await fetch(`${apiBaseUrl}/api/contact`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log(errorData);
      return [];
    }
    const data: ContactMessage[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return [];
  }
};
