import os
import re
import glob

def clean_text(text):
    return re.sub(r'\s+', ' ', text).strip()

def get_title(content):
    m = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
    return clean_text(m.group(1)) if m else "Win Equipments | Industrial Cooling & Compressed Air"

def get_desc(content):
    m = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', content, re.IGNORECASE)
    if not m:
        m = re.search(r'<meta\s+content=["\'](.*?)["\']\s+name=["\']description["\']', content, re.IGNORECASE)
    return clean_text(m.group(1)) if m else "Direct manufacturer of precision industrial chillers, cooling towers, and compressed air dryers in Coimbatore."

def get_canonical(content, file_path):
    m = re.search(r'<link\s+rel=["\']canonical["\']\s+href=["\'](.*?)["\']', content, re.IGNORECASE)
    if m:
        return m.group(1)
    if file_path == 'index.html':
        return 'https://winequipments.com/'
    return f'https://winequipments.com/{file_path}'

def get_image(content, file_path):
    # Check for specific product/hero image
    m = re.search(r'<img[^>]+src=["\']([^"\']+\.(?:png|jpg|jpeg|webp))["\']', content, re.IGNORECASE)
    if m:
        src = m.group(1)
        if not src.startswith(('http://', 'https://')):
            # resolve relative
            dir_name = os.path.dirname(file_path)
            clean_src = os.path.normpath(os.path.join(dir_name, src)).replace('\\', '/')
            if 'logo' not in clean_src:
                return f'https://winequipments.com/{clean_src}'
    return 'https://winequipments.com/images/banner_opt.jpg'

all_files = sorted(glob.glob('**/*.html', recursive=True))
updated_count = 0

for file_path in all_files:
    if 'node_modules' in file_path or '.git' in file_path:
        continue
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip refresh redirects
    if 'http-equiv="refresh"' in content or 'http-equiv=\'refresh\'' in content:
        continue

    title = get_title(content)
    desc = get_desc(content)
    canonical = get_canonical(content, file_path)
    image = get_image(content, file_path)
    is_article = file_path.startswith('blog/')
    og_type = "article" if is_article else "website"
    locale = "ta_IN" if file_path.startswith('ta/') else "en_IN"

    modified = False

    # 1. OpenGraph & Twitter Card
    if 'og:title' not in content:
        social_meta = f'''  <!-- Open Graph & Social Sharing -->
  <meta property="og:type" content="{og_type}">
  <meta property="og:site_name" content="Win Equipments">
  <meta property="og:url" content="{canonical}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:image" content="{image}">
  <meta property="og:locale" content="{locale}">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="{canonical}">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{desc}">
  <meta name="twitter:image" content="{image}">
'''
        # Insert after canonical or title
        if '<link rel="canonical"' in content:
            content = re.sub(r'(<link\s+rel=["\']canonical["\'].*?>)', r'\1\n' + social_meta, content, count=1)
            modified = True
        elif '</title>' in content:
            content = content.replace('</title>', '</title>\n' + social_meta, 1)
            modified = True

    # 2. BlogPosting & Breadcrumb Schema on Blog posts
    if is_article and 'BlogPosting' not in content:
        clean_headline = title.split('|')[0].strip()
        blog_schema = f'''
  <!-- Blog Article & Breadcrumb Schema -->
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@graph": [
      {{
        "@type": "BlogPosting",
        "headline": "{clean_headline}",
        "description": "{desc}",
        "url": "{canonical}",
        "image": "{image}",
        "datePublished": "2026-09-17T08:00:00+05:30",
        "dateModified": "2026-09-17T08:00:00+05:30",
        "mainEntityOfPage": "{canonical}",
        "author": {{
          "@type": "Person",
          "name": "Mr. Ramasamy Ananthakumar",
          "jobTitle": "Chief Engineer & Proprietor",
          "worksFor": {{
            "@type": "Organization",
            "name": "Win Equipments"
          }}
        }},
        "publisher": {{
          "@type": "Organization",
          "name": "Win Equipments",
          "logo": {{
            "@type": "ImageObject",
            "url": "https://winequipments.com/images/logo.png"
          }}
        }}
      }},
      {{
        "@type": "BreadcrumbList",
        "itemListElement": [
          {{
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://winequipments.com/"
          }},
          {{
            "@type": "ListItem",
            "position": 2,
            "name": "Technical Knowledge Hub",
            "item": "https://winequipments.com/blog.html"
          }},
          {{
            "@type": "ListItem",
            "position": 3,
            "name": "{clean_headline}",
            "item": "{canonical}"
          }}
        ]
      }}
    ]
  }}
  </script>
'''
        content = content.replace('</head>', blog_schema + '</head>', 1)
        modified = True

    # 3. Engineering Tools Breadcrumb Schema
    if file_path.startswith('engineering-tools/') and 'BreadcrumbList' not in content:
        tool_name = title.split('|')[0].strip()
        calc_schema = f'''
  <!-- Breadcrumb Schema -->
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {{
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://winequipments.com/"
      }},
      {{
        "@type": "ListItem",
        "position": 2,
        "name": "Engineering Tools",
        "item": "https://winequipments.com/index.html#calculators"
      }},
      {{
        "@type": "ListItem",
        "position": 3,
        "name": "{tool_name}",
        "item": "{canonical}"
      }}
    ]
  }}
  </script>
'''
        content = content.replace('</head>', calc_schema + '</head>', 1)
        modified = True

    # 4. Tamil Hub Schema
    if file_path == 'ta/index.html' and 'LocalBusiness' not in content:
        ta_schema = '''
  <!-- LocalBusiness Schema for Tamil Nadu Facility -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Win Equipments (வின் எக்யூப்மென்ட்ஸ்)",
    "legalName": "Win Equipments",
    "description": "கோயம்புத்தூரில் சிறந்த தரமான ஏர் டிரையர், இண்டஸ்ட்ரியல் வாட்டர் சில்லர் மற்றும் FRP கூலிங் டவர் உற்பத்தியாளர்கள்.",
    "url": "https://winequipments.com/ta/",
    "logo": "https://winequipments.com/images/logo.png",
    "image": "https://winequipments.com/images/banner_opt.jpg",
    "telephone": "+91-9597228969",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "SF No: 4, 195 B, Kallangadu, Arasur Post",
      "addressLocality": "Coimbatore",
      "addressRegion": "Tamil Nadu",
      "postalCode": "641407",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 11.0507,
      "longitude": 77.1084
    },
    "priceRange": "$$"
  }
  </script>
'''
        content = content.replace('</head>', ta_schema + '</head>', 1)
        modified = True

    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        updated_count += 1

print(f'Successfully updated metadata & schemas in {updated_count} files.')
