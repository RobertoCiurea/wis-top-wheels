import { auth } from "@/auth";
export async function checkOlxConnectionStatus(): Promise<boolean> {
  const session = await auth();
  if (!session || !session.user) return false;

  const accessToken = (session as any).accessToken;
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";
  try {
    const response = await fetch(`${apiBaseUrl}/api/olx/auth/status`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });
    if (!response.ok) return false;
    const data = await response.json();
    return data.isConnected === true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
