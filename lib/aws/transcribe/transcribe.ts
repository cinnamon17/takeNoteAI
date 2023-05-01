import { StartTranscriptionJobCommand } from '@aws-sdk/client-transcribe'
import { transcribeClient } from './transcribe-client'

export const transcribeAudio = async (name: string, source: string, format: string) => {
  const params = {
    TranscriptionJobName: name,
    LanguageCode: process.env.AWS_TRANSCRIBE_LANGUAGE,
    MediaFormat: format,
    Media: {
      MediaFileUri: source
    },
    OutputBucketName: process.env.AWS_TRANSCRIBE_OUTPUT
  }

  try {
    const command = new StartTranscriptionJobCommand(params)
    const data = await transcribeClient.send(command)
    console.log('Success - put', data)
    return { data }
  } catch (err) {
    console.log('Error', err)
  }
}
