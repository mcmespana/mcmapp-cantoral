import os
import urllib.request
import urllib.error
import time
import re


def find_latest_version(songs_dir):
    version_pattern = re.compile(r'^songs-v(\d+)(?:\.(\d+))?\.json$')
    versions = []
    for fname in os.listdir(songs_dir):
        m = version_pattern.match(fname)
        if m:
            major = int(m.group(1))
            minor = int(m.group(2)) if m.group(2) else 0
            versions.append((major, minor, fname))
    if not versions:
        raise RuntimeError('No songs versions found')
    versions.sort()
    return versions[-1][2]  # return filename of latest version


def main():
    firebase_url = os.environ['FIREBASE_URL'].rstrip('/')
    token = os.environ['FIREBASE_TOKEN']
    songs_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'songs')

    latest_file = find_latest_version(songs_dir)
    json_path = os.path.join(songs_dir, latest_file)

    with open(json_path, 'r', encoding='utf-8') as f:
        data = f.read().encode('utf-8')

    def request(url, body):
        req = urllib.request.Request(url, data=body, method='PUT', headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req) as resp:
            if resp.status < 200 or resp.status >= 300:
                raise RuntimeError(f"Request to {url} failed with status {resp.status}")
            resp.read()
    # Update songs/data
    url_data = f"{firebase_url}/songs/data.json?auth={token}"
    request(url_data, data)

    # Update songs/updatedAt with Unix timestamp
    timestamp = str(int(time.time()))
    url_time = f"{firebase_url}/songs/updatedAt.json?auth={token}"
    request(url_time, timestamp.encode('utf-8'))


if __name__ == '__main__':
    main()
