#!/usr/bin/env python3
"""Local-only browser tool that captures the 3D viewer posters (and previews the model) using the current renderer source.

Usage: python3 src/site/tools/render_model_posters.py [dryer|tower]   then open http://127.0.0.1:8087/
"""
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
# per model: renderer source, initial pose (keep in step with data-c3-home in its partial), output folder
MODELS = {
    'dryer': {'js': 'dryer3d.js', 'ry': 28, 'rx': -12},
    'tower': {'js': 'tower3d.js', 'ry': 20, 'rx': -10},
}
MODEL = sys.argv[1] if len(sys.argv) > 1 else 'dryer'
if MODEL not in MODELS:
    sys.exit('Unknown model ' + MODEL + '; choose one of ' + ', '.join(MODELS))
CFG = MODELS[MODEL]


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT / 'public'), **kwargs)

    def send_body(self, body, ctype):
        self.send_response(200)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = self.path.split('?')[0]
        if path == '/':
            page = (ROOT / 'src/site/tools/render-model-posters.html').read_text()
            page = page.replace('__MODEL__', MODEL).replace('__JS__', CFG['js']).replace('__RY__', str(CFG['ry'])).replace('__RX__', str(CFG['rx']))
            return self.send_body(page.encode(), 'text/html')
        if path == '/js/' + CFG['js']:
            return self.send_body((ROOT / 'src/site/assets/js' / CFG['js']).read_bytes(), 'text/javascript')
        return super().do_GET()

    def do_POST(self):
        quality = self.path.removeprefix('/__poster/')
        length = int(self.headers.get('Content-Length', '0'))
        if quality not in ('standard', 'lite') or not 0 < length < 10_000_000:
            return self.send_error(400)
        body = self.rfile.read(length)
        if not body.startswith(b'\x89PNG\r\n\x1a\n'):
            return self.send_error(400)
        (ROOT / 'images' / (MODEL + '-renders') / (MODEL + '-poster-' + quality + '.png')).write_bytes(body)
        self.send_response(204)
        self.end_headers()


if __name__ == '__main__':
    (ROOT / 'images' / (MODEL + '-renders')).mkdir(parents=True, exist_ok=True)
    print('Rendering ' + MODEL + ' posters. Open http://127.0.0.1:8087/ and click Render both posters. Ctrl+C stops the server.', flush=True)
    ThreadingHTTPServer(('127.0.0.1', 8087), Handler).serve_forever()
