import os
import re
import glob
import json
import xml.etree.ElementTree as ET

html_files = sorted(glob.glob('**/*.html', recursive=True))
print(f"Total HTML files found: {len(html_files)}")

broken_links = []
missing_design_system = []
missing_components_css = []
missing_main_js = []
missing_mobile_toggle = []
missing_title = []
missing_desc = []
missing_canonical = []
missing_og = []
missing_twitter = []
unresponsive_tables = []
navbar_placeholder_found = []
missing_schemas = []
json_errors = []

for file_path in html_files:
    if 'node_modules' in file_path or '.git' in file_path:
        continue
        
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    is_redirect = 'http-equiv="refresh"' in content or 'http-equiv=\'refresh\'' in content
    is_404 = file_path == '404.html'

    if not is_redirect:
        # Title
        if not re.search(r'<title>(.*?)</title>', content, re.IGNORECASE):
            missing_title.append(file_path)

        # Meta description
        if not re.search(r'<meta\s+name=["\']description["\']', content, re.IGNORECASE) and not re.search(r'<meta\s+content=["\'][^"\']+["\']\s+name=["\']description["\']', content, re.IGNORECASE):
            missing_desc.append(file_path)

        # Canonical (404 does not need canonical)
        if not is_404 and not re.search(r'<link\s+rel=["\']canonical["\']', content, re.IGNORECASE):
            missing_canonical.append(file_path)

        # Design system css
        if 'design-system.css' not in content:
            missing_design_system.append(file_path)

        # Components css
        if 'components.css' not in content:
            missing_components_css.append(file_path)

        # Main.js
        if 'main.js' not in content:
            missing_main_js.append(file_path)

        # Mobile toggle button
        if 'mobile-toggle-btn' not in content:
            missing_mobile_toggle.append(file_path)

        # Navbar placeholder check
        if 'navbar-placeholder' in content:
            navbar_placeholder_found.append(file_path)

        # OpenGraph & Twitter
        if not is_404:
            if 'og:title' not in content:
                missing_og.append(file_path)
            if 'twitter:card' not in content:
                missing_twitter.append(file_path)

        # Unresponsive tables
        tables = re.findall(r'<table[^>]*>', content, re.IGNORECASE)
        if tables:
            if 'spec-table-container' not in content and 'table-responsive' not in content and 'blog-table-container' not in content:
                unresponsive_tables.append(file_path)

        # JSON-LD Schema Validation
        schemas = re.findall(r'<script\s+type=[\'\"]application/ld\+json[\'\"]>([\s\S]*?)</script>', content)
        for idx, s in enumerate(schemas):
            try:
                json.loads(s.strip())
            except Exception as e:
                json_errors.append((file_path, idx, str(e)))

        # Specialized Schemas
        if file_path.startswith('blog/'):
            if 'BlogPosting' not in content:
                missing_schemas.append((file_path, 'BlogPosting'))
            if 'BreadcrumbList' not in content:
                missing_schemas.append((file_path, 'BreadcrumbList'))
        elif file_path.startswith('engineering-tools/'):
            if 'BreadcrumbList' not in content:
                missing_schemas.append((file_path, 'BreadcrumbList'))

    # Internal link verification
    hrefs = re.findall(r'href=["\']([^"\']+)["\']', content)
    file_dir = os.path.dirname(file_path)

    for href in hrefs:
        href_clean = href.split('#')[0].split('?')[0].strip()
        if not href_clean:
            continue
        if href_clean.startswith(('http://', 'https://', 'mailto:', 'tel:', 'javascript:', '#', 'data:')):
            continue

        target_path = os.path.normpath(os.path.join(file_dir, href_clean))
        if not os.path.exists(target_path):
            if not os.path.exists(target_path + '.html'):
                if not os.path.exists(os.path.join(target_path, 'index.html')):
                    broken_links.append((file_path, href, target_path))

# Check Sitemap
tree = ET.parse('sitemap.xml')
root = tree.getroot()
sitemap_urls = [el.text for el in root.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]

print("\n================= AUDIT RESULTS =================")
print(f"Total Canonical URLs in sitemap.xml: {len(sitemap_urls)}")
print(f"Broken Internal Links: {len(broken_links)}")
for source, href, target in broken_links:
    print(f"  [BROKEN] {source} -> {href} (Resolved: {target})")

print(f"Missing design-system.css: {len(missing_design_system)}")
print(f"Missing components.css: {len(missing_components_css)}")
print(f"Missing main.js: {len(missing_main_js)}")
print(f"Missing mobile-toggle-btn: {len(missing_mobile_toggle)}")
print(f"Navbar-placeholder found: {len(navbar_placeholder_found)}")
print(f"Unresponsive tables: {len(unresponsive_tables)}")
print(f"Missing canonical: {len(missing_canonical)}")
print(f"Missing OpenGraph: {len(missing_og)}")
print(f"Missing Twitter Cards: {len(missing_twitter)}")
print(f"JSON-LD Schema Errors: {len(json_errors)}")
print(f"Specialized Schema Gaps: {len(missing_schemas)}")
print("=================================================\n")
