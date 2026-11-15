"""Dependency-free checks for the published pages and local resources."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import unittest

ROOT = Path(__file__).resolve().parent.parent

class Page(HTMLParser):
    def __init__(self, file):
        super().__init__(convert_charrefs=True)
        self.elements = []
        self.feed(file.read_text())
    def handle_starttag(self, tag, attrs):
        self.elements.append((tag, dict(attrs)))

PAGES = {p.name: Page(p) for p in ROOT.glob('*.html')}

class SiteTests(unittest.TestCase):
    def test_page_count(self):
        self.assertEqual(len(PAGES), 9)

    def test_local_links_and_assets(self):
        for name, page in PAGES.items():
            for tag, attrs in page.elements:
                for attr in ('href', 'src'):
                    if attr not in attrs:
                        continue
                    url = urlsplit(attrs[attr])
                    if url.scheme or url.netloc:
                        continue
                    dest = unquote(url.path) or name
                    self.assertTrue((ROOT / dest).is_file(), f'{name}: {attrs[attr]}')
                    if url.fragment and dest in PAGES:
                        ids = [a.get('id') for _, a in PAGES[dest].elements]
                        self.assertIn(unquote(url.fragment), ids, f'{name}: {attrs[attr]}')

    def test_accessible_page_basics(self):
        for name, page in PAGES.items():
            with self.subTest(page=name):
                self.assertEqual(sum(t == 'h1' for t, _ in page.elements), 1)
                self.assertEqual(sum(t == 'main' for t, _ in page.elements), 1)
                ids = [a['id'] for _, a in page.elements if 'id' in a]
                self.assertEqual(len(ids), len(set(ids)))
                for tag, attrs in page.elements:
                    if tag == 'img':
                        self.assertTrue(attrs.get('alt'))
                controls = [a for t, a in page.elements if t == 'button' and 'menu-toggle' in a.get('class', '')]
                self.assertEqual(len(controls), 1)
                self.assertEqual(controls[0]['aria-expanded'], 'false')
                self.assertIn(controls[0]['aria-controls'], ids)

    def test_contact_destinations(self):
        for name, page in PAGES.items():
            for tag, attrs in page.elements:
                href = attrs.get('href', '')
                self.assertNotEqual(href, 'https://google.com', name)
                if href.startswith('https://wa.me'):
                    self.assertEqual(href, 'https://wa.me/250789813896')
                if attrs.get('target') == '_blank':
                    self.assertIn('noopener', attrs.get('rel', ''))

    def test_form_fallback_and_labels(self):
        elements = PAGES['book.html'].elements
        form = next(a for t, a in elements if t == 'form')
        self.assertEqual(form['action'], 'https://api.web3forms.com/submit')
        labels = {a['for'] for t, a in elements if t == 'label'}
        for tag, attrs in elements:
            if tag in ('input', 'select', 'textarea') and attrs.get('type') not in ('hidden', 'checkbox'):
                self.assertIn(attrs['id'], labels)
        status = next(a for _, a in elements if a.get('id') == 'formMessage')
        self.assertEqual(status['role'], 'status')
        self.assertEqual(status['aria-live'], 'polite')

if __name__ == '__main__':
    unittest.main()
