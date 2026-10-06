#!/usr/bin/env python3
"""Local-only browser tool that captures posters using the current renderer source."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT / 'public'), **kwargs)

    def do_GET(self):
        path = self.path.split('?')[0]
        if path == '/':
            source = ROOT / 'src/site/tools/render-chiller-posters.html'
        elif path == '/js/chiller3d.js':
            source = ROOT / 'src/site/assets/js/chiller3d.js'
        else:
            return super().do_GET()
        body = source.read_bytes()
        self.send_response(200)
        self.send_header('Content-Type', 'text/javascript' if source.suffix == '.js' else 'text/html')
        self.send_header('Content-Length', str(len(body)))
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
        (ROOT / 'images/chiller-renders' / f'chiller-poster-{quality}.png').write_bytes(body)
        self.send_response(204)
        self.end_headers()


if __name__ == '__main__':
    print('Open http://127.0.0.1:8086/ and click Render both posters. Ctrl+C stops the server.', flush=True)
    ThreadingHTTPServer(('127.0.0.1', 8086), Handler).serve_forever()
