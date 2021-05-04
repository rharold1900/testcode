import json
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Patient')

def lambda_handler(event, context):
    print( "start patientGet")
    
    # check parameters here
    
    
    # get to dynamob record
    print( event )

    try:
        response = table.get_item(Key=event)
        print( response )
    except ClientError as e:
        print(e.response['Error']['Message'])
        return {
            'statusCode': 500, 'message' : "Lambda function issue", 'body': json.dumps('Lambda Error')
        }
    else:
        # if not Item then data was not there
        if response.get('Item',None) == None:
            print("no data found")
            return {
                'statusCode': 200, 'errormessage' : "Item not found", 'body': json.dumps('NO DATA')
            }
        else:
            return response['Item']


