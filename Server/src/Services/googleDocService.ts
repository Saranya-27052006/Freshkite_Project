import { google } from "googleapis";
import { JWT } from "google-auth-library";
import path from "path";

export async function fetchGoogleDocAsMarkdown(
  docId: string
): Promise<string | undefined> {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, "../utils/service-account.json"),
      scopes: ["https://www.googleapis.com/auth/documents.readonly"],
    });

    const client = (await auth.getClient()) as JWT;
    const docs = google.docs({ version: "v1", auth: client });

    const res = await docs.documents.get({ documentId: docId });
    const content = res.data.body?.content || [];

    let markdown = "";

    for (const element of content) {
      const paragraph = element.paragraph;
      if (!paragraph) continue;

      const text = paragraph.elements
        ?.map((el) => el.textRun?.content || "")
        .join("")
        .trim();

      const style = paragraph.paragraphStyle?.namedStyleType || "";

      if (style === "HEADING_1") markdown += `# ${text}\n\n`;
      else if (style === "HEADING_2") markdown += `## ${text}\n\n`;
      else if (style === "HEADING_3") markdown += `### ${text}\n\n`;
      else if (style === "HEADING_4") markdown += `#### ${text}\n\n`;
      else if (style === "HEADING_5") markdown += `##### ${text}\n\n`;
      else if (style === "HEADING_6") markdown += `###### ${text}\n\n`;
      else if (paragraph.bullet) markdown += `- ${text}\n`;
      else markdown += `${text}\n`;
    }

    return markdown;
  } catch (error) {
    console.error(
      "Error fetching document:",
      error instanceof Error ? error.message : error
    );
  }
}
