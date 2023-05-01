import { TranscribeClient } from "@aws-sdk/client-transcribe";

const transcribeClient = new TranscribeClient({
  region: process.env.AWS_TRANSCRIBE_REGION
});
export { transcribeClient };
