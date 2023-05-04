import { StartTranscriptionJobCommand, GetTranscriptionJobCommand } from '@aws-sdk/client-transcribe'
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
    const response = await transcribeClient.send(command)
    return response.TranscriptionJob?.TranscriptionJobName
  } catch (err) {
    console.log('Error', err)
  }
}

export const fetchTranscribeJob = async (id: string) => {

  try {

    const command = new GetTranscriptionJobCommand({
      TranscriptionJobName: id
    })

    const response = await transcribeClient.send(command)

    const status = response.TranscriptionJob?.TranscriptionJobStatus
    const url = response.TranscriptionJob?.Transcript?.TranscriptFileUri

    return { status, url }

  } catch (err) {
    console.log('Error', err)
  }
}
