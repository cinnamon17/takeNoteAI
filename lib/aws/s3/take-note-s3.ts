import { s3Client } from './s3-client'
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'

export const uploadFileToS3 = async function(filename: string, buffer: Buffer) {
  try {
    const params = {
      Bucket: process.env.AWS_TRANSCRIBE_OUTPUT,
      Key: filename,
      Body: buffer
    }

    const command = new PutObjectCommand(params)
    const response = await s3Client.send(command)
    console.log(response)
    return { response }
  } catch (e) {
    throw e
  }
}

export const getObjectFromS3 = async function(key: string): Promise<string | undefined> {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_TRANSCRIBE_OUTPUT,
      Key: key
    })
    const response = await s3Client.send(command)
    return await response.Body?.transformToString()
  } catch (e) {
    throw  e
  }
}
