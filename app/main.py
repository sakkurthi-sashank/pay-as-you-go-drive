from fastapi import FastAPI, HTTPException, Request
import json
import ffmpeg
import os
import uvicorn
import boto3
from .config import settings
from uuid import uuid4

app = FastAPI()

s3 = boto3.client("s3", aws_access_key_id=settings.aws_access_key_id,
                  aws_secret_access_key=settings.aws_secret_access_key, region_name="ap-south-2")


@app.post("/")
async def receive_sns_message(message: Request):
    try:
        sns_message = await message.body()
        sns_message = sns_message.decode("utf-8")

        sns_message = json.loads(sns_message)

        bucket = sns_message["Records"][0]["s3"]["bucket"]["name"]
        key = sns_message["Records"][0]["s3"]["object"]["key"]

        print(f"Bucket: {bucket}")
        print(f"Key: {key}")

        output_file_path = f"/tmp/{uuid4()}.mp4"

        s3.download_file(bucket, key, output_file_path)

        stream = ffmpeg.input(output_file_path)
        stream = ffmpeg.filter(stream, "scale", -1, 360)
        stream = ffmpeg.output(stream, output_file_path,
                               **{'c:v': 'libx264', 'c:a': 'copy'})
        ffmpeg.run(stream)

        s3_output_bucket = "video-paas-video-converted"
        s3_object_key = f"{uuid4()}.mp4"
        s3.upload_file(output_file_path, s3_output_bucket, s3_object_key)

        os.remove(output_file_path)

        return {"message": "Video processing completed and uploaded to S3",
                "status_code": 200,
                "processed_video_s3_bucket": s3_output_bucket,
                "processed_video_s3_key": s3_object_key}

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
