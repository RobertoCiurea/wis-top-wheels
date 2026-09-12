import { signIn } from "@/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  await signIn("keycloak", { redirectTo: callbackUrl });
}
