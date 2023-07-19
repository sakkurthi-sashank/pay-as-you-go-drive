import json
import boto3

# Initialize the S3 and SNS clients outside the handler function
s3 = boto3.client('s3')
sns = boto3.client('sns')
sns_topic_arn = 'arn:aws:sns:ap-south-2:820964988012:video-paas-convert-video-sns'


def lambda_handler(event, context):
    try:
        # Validate the input event
        if 'Records' not in event or not event['Records']:
            return {
                'statusCode': 400,
                'body': json.dumps('Invalid input: No S3 records found in the event.')
            }

        # Create a message to send with the event data
        message = json.dumps(event)

        # Publish the message to the SNS topic

        publish_response = sns.publish(TopicArn=sns_topic_arn, Message=message)

        print(publish_response)

        return {
            'statusCode': 200,
            'body': json.dumps('SNS notification sent')
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error: {str(e)}')
        }
