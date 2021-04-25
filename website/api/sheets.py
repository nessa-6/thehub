import gspread
from oauth2client.service_account import ServiceAccountCredentials
from pprint import pprint

scope = ["https://spreadsheets.google.com/feeds",'https://www.googleapis.com/auth/spreadsheets',"https://www.googleapis.com/auth/drive.file","https://www.googleapis.com/auth/drive"]

creds = ServiceAccountCredentials.from_json_keyfile_name("creds.json", scope)

client = gspread.authorize(creds)

sheet = client.open("maths questions").sheet1  # Open the spreadhseet

data = sheet.get_all_records()  # Get a list of all records

new_data = [x for x in data if x['NEW?'] == 'NEW']

for x in sheet.col_values(1): # A
    if x == '3':
        pprint(sheet.acell('A4').value)

dic = {}
li = []
for x in new_data:
    dic = {}
    num = int(x['ID']) + 1
    dic['range'] = 'I' + str(num)
    dic['values'] = [['OLD']]
    print(dic)
    li.append(dic)

sheet.batch_update(li)

