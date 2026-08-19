import { generatePresignedUrl } from "@/app/actions/presignedUrlAction";

export async function uploadFilesToSTorage(files: File[]): Promise<string[]> {
  const uploadedUrls: string[] = [];
  for (const file of files) {
    const { presignedUrl, objectUrl } = await generatePresignedUrl(
      file.name,
      file.type,
    );
    const uploadResponse = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error("Error uploading file " + file.name);
    }
    uploadedUrls.push(objectUrl);
  }
  return uploadedUrls;
}
