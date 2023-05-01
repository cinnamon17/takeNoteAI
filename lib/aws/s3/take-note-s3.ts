import { s3Client } from './s3-client'
import { PutObjectCommand } from '@aws-sdk/client-s3'

export const uploadFile = async function(filename: string, buffer: Buffer) {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET,
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
