#!/usr/bin/env python3
"""Check the source-level text, accessibility-attribute, and SEO content lock."""

from html.parser import HTMLParser
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
BASELINE = Path(__file__).with_name("content-lock.json")
ROUTES = {
    "/": "index.html",
    "/apk": "apk/index.html",
    "/download": "download/index.html",
    "/shaikhs": "shaikhs/index.html",
    "/projects/shaikhs": "projects/shaikhs/index.html",
}
TEXT_ATTRIBUTES = {
    "aria-label",
    "aria-labelledby",
    "aria-describedby",
    "aria-hidden",
    "aria-live",
    "aria-pressed",
    "aria-expanded",
    "aria-controls",
    "alt",
    "title",
    "placeholder",
    "value",
    "data-label",
    "data-copy",
    "data-copy-label",
}
SEO_META = {
    "description",
    "author",
    "og:site_name",
    "og:title",
    "og:description",
    "og:image:alt",
    "twitter:card",
    "twitter:title",
    "twitter:description",
}


class ContentEvents(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.events = []
        self.skip_content = 0

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag in {"script", "style"}:
            self.skip_content += 1

        if tag == "meta":
            name = values.get("name") or values.get("property")
            if name in SEO_META and values.get("content") is not None:
                self.events.append({"kind": "meta", "name": name, "value": values["content"]})

        for name, value in attrs:
            if name in TEXT_ATTRIBUTES and value is not None:
                self.events.append({"kind": "attribute", "tag": tag, "name": name, "value": value})

    def handle_endtag(self, tag):
        if tag in {"script", "style"}:
            self.skip_content = max(0, self.skip_content - 1)

    def handle_data(self, data):
        value = " ".join(data.split())
        if value and not self.skip_content:
            self.events.append({"kind": "text", "value": value})


def read_events(path):
    parser = ContentEvents()
    parser.feed(path.read_text(encoding="utf-8"))
    return parser.events


def main():
    expected = json.loads(BASELINE.read_text(encoding="utf-8"))
    failed = False

    for route, relative_path in ROUTES.items():
        actual = read_events(ROOT / relative_path)
        locked = expected[route]
        exact = actual == locked
        print(f"{route:18} {len(actual):3} events — {'PASS' if exact else 'FAIL'}")
        if exact:
            continue

        failed = True
        for index, (before, after) in enumerate(zip(locked, actual)):
            if before != after:
                print(f"  first difference at event {index}:\n    baseline: {before}\n    current:  {after}")
                break
        if len(locked) != len(actual):
            print(f"  event count changed: {len(locked)} -> {len(actual)}")

    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
