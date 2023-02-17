

import cloudscraper
import argparse
import json
from base64 import urlsafe_b64encode

parser = argparse.ArgumentParser()
parser.add_argument('--url')
parser.add_argument('--method')
parser.add_argument('--data')
parser.add_argument('--headers')
args = parser.parse_args()

try:
    if args.method == "GET":
        req = None
        if args.headers != None:
            headers = json.loads(args.headers)
            req = cloudscraper.create_scraper().get(args.url, timeout=3, headers=headers)
        else:
            req = cloudscraper.create_scraper().get(args.url, timeout=3)
        print(urlsafe_b64encode((req.text.encode("UTF-8"))))
        print("{ statusCode: " + str(req.status_code) + " }")
    elif args.method == "POST":
        json_data = json.loads(args.data)
        req = None
        if args.headers != None:
            headers = json.loads(args.headers)
            req = cloudscraper.create_scraper().post(args.url, data=json_data, timeout=3, headers=headers)
        else:
            req = cloudscraper.create_scraper().post(args.url, data=json_data, timeout=3)
        print(urlsafe_b64encode((req.text.encode("UTF-8"))))
        print("{ statusCode: " + str(req.status_code) + " }")
    elif args.method == "COOKIE":
        print(cloudscraper.get_cookie_string(args.url))
    elif args.method == "TOKENS":
        print(cloudscraper.get_tokens(args.url))
    else:
        req = None
        if args.headers != None:
            headers = json.loads(args.headers)
            req = cloudscraper.create_scraper().get(args.url, timeout=3, headers=headers)
        else:
            req = cloudscraper.create_scraper().get(args.url, timeout=3)
        print(urlsafe_b64encode((req.text.encode("UTF-8"))))
        print("{ statusCode: " + str(req.status_code) + " }")
except:
    raise Exception("Could not send data to " + args.url + " with request data " + args.data + ".")