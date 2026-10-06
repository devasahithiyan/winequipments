#!/usr/bin/env python3
"""Local-only browser tool that captures the dryer posters (and previews the model) using the current renderer source."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
PAGES = {'/': 'src/site/tools/render-dryer-posters.html', '/js/dryer3d.js': 'src/site/assets/js/dryer3d.js'}


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT / 'public'), **kwargs)

    def do_GET(self):
        source = PAGES.get(self.path.split('?')[0])
        if not source:
            return super().do_GET()
        body = (ROOT / source).read_bytes()
        self.send_response(200)
        self.send_header('Content-Type', 'text/javascript' if source.endswith('.js') else 'text/html')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        quality = self.path.removeprefix('/__poster/')
        length = int(self.headers.get('Content-Length', '0'))
        if quality not in ('standard', 'lite') or not 0 < length < 10_000_000:
            return self.send_error(400)
        body = self.rfile.read(length)
        if not body.startswith(b'\x89PNG\r\n\x1a\n'):
            return self.send_error(400)
        (ROOT / 'images/dryer-renders' / f'dryer-poster-{quality}.png').write_bytes(body)
        self.send_response(204)
        self.end_headers()


if __name__ == '__main__':
    (ROOT / 'images/dryer-renders').mkdir(parents=True, exist_ok=True)
    print('Open http://127.0.0.1:8087/ and click Render both posters. Ctrl+C stops the server.', flush=True)
    ThreadingHTTPServer(('127.0.0.1', 8087), Handler).serve_forever()
