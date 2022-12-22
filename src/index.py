from cfscraper import cloudscraper

import argparse
import json
import sys
from base64 import urlsafe_b64encode

sys.path.insert(0, '/src/cfscraper')

parser = argparse.ArgumentParser()
parser.add_argument('--url')
parser.add_argument('--method')
parser.add_argument('--data')
parser.add_argument('--headers')
parser.add_argument('--allow-redirect')
args = parser.parse_args()

args.allow_redirect = True if args.allow_redirect == "True" else False

try:
    if args.method == "GET":
        req = None
        if args.headers != None:
            headers = json.loads(args.headers)
            req = cloudscraper.create_scraper().get(args.url, timeout=3, headers=headers, allow_redirects=args.allow_redirect)
        else:
            req = cloudscraper.create_scraper().get(args.url, timeout=3, allow_redirects=args.allow_redirect)
        print(urlsafe_b64encode(req.text.encode("UTF-8")))
        print(("~~~~~~~REQUEST_DATA~~~~~~~").encode("UTF-8"))
        res = {"status_code": req.status_code, "url": req.url}
        print(urlsafe_b64encode(json.dumps(res).encode("UTF-8")))
    elif args.method == "POST":
        json_data = json.loads(args.data)
        req = None
        if args.headers != None:
            headers = json.loads(args.headers)
            req = cloudscraper.create_scraper().post(args.url, data=json_data, timeout=3, headers=headers, allow_redirects=args.allow_redirect)
        else:
            req = cloudscraper.create_scraper().post(args.url, data=json_data, timeout=3, allow_redirects=args.allow_redirect)
        print(urlsafe_b64encode(req.text.encode("UTF-8")))
        print(("~~~~~~~REQUEST_DATA~~~~~~~").encode("UTF-8"))
        res = {"status_code": req.status_code, "url": req.url}
        print(urlsafe_b64encode(json.dumps(res).encode("UTF-8")))
    elif args.method == "COOKIE":
        print(cloudscraper.get_cookie_string(args.url))
    elif args.method == "TOKENS":
        print(cloudscraper.get_tokens(args.url))
    else:
        req = None
        if args.headers != None:
            headers = json.loads(args.headers)
            req = cloudscraper.create_scraper().get(args.url, timeout=3, headers=headers, allow_redirects=args.allow_redirect)
        else:
            req = cloudscraper.create_scraper().get(args.url, timeout=3, allow_redirects=args.allow_redirect)
        print(urlsafe_b64encode(req.text.encode("UTF-8")))
        print(("~~~~~~~REQUEST_DATA~~~~~~~").encode("UTF-8"))
        res = {"status_code": req.status_code, "url": req.url}
        print(urlsafe_b64encode(json.dumps(res).encode("UTF-8")))
except:
    raise Exception("Could not send data to " + args.url + " with request data " + args.data + ".")