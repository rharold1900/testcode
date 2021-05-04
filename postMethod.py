import json
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Patient')

def lambda_handler(event, context):
    print( "start patientAdd")
    
    # check parameters here
    
    try:
        # push to dynamob record
        response = table.put_item(Item=event)
    except ClientError as e:
        print(e.response['Error']['Message'])
        return {
            'statusCode': 400, 'message' : "Data  issue", 'body': json.dumps('Lambda Error Add')
        }
    else:
        return {
            'statusCode': 200, 'message' : "Successful operation", 'body': json.dumps('Hello from Lambda!')
        }
