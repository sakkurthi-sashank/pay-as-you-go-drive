from pydantic import BaseModel


class ConvertVideoRequest(BaseModel):
    input_video: str
    output_path: str
