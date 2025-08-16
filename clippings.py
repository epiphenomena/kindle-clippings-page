"""
Parses My Clippings.txt from kindle reader.

Connect kindle to computer. Open as disk/folder. Copy My Clippings.txt.
"""


import click
import timestamp
import jinja2
import pathlib

HERE = pathlib.Path(__file__).parent.resolve()

ENV = jinja2.Environment(
    line_statement_prefix="%",
    loader=jinja2.FileSystemLoader(str(HERE)),
    undefined=jinja2.StrictUndefined,
    optimized=False,
)
ENV.globals["timestamp"] = timestamp


class Highlight:
    def __init__(self, title, dt, loc, text):
        self.title, self.dt, self.loc, self.text = title, dt, loc, text

    @property
    def author(self):
        if "(" not in self.title:
            return "Unknown"
        return self.title.split("(")[1].split(")")[0]


def parse_meta(m):
    assert m.startswith("- Your Highlight"), m
    try:
        rloc, _, rdt = m.rpartition("|")
        loc = rloc.split("Location")[1].strip()
        dt = timestamp.pend.parse(
            rdt.split("Added on")[1].strip().partition(" ")[2],
            strict=False,
        )
    except:
        print("ERROR in parsing meta:")
        breakpoint()
    return dt, loc


def parse_clipping(highlight):
    lines = highlight.strip().splitlines()
    if len(lines) != 4 or lines[3] == "":
        try:
            if lines[1].startswith("- Your Bookmark"):
                print("Skipping bookmark.")
                return None
        except:
            pass
        print(f"ERROR PARSING: {highlight}")
        return None
    lines = iter(lines)
    title = next(lines)
    if title[0] == "\ufeff":
        # trim the hex character
        title = title[1:]
    meta = next(lines)
    if meta.startswith("- Your Note"):
        return None
    dt, loc = parse_meta(meta)
    blank = next(lines)  # blank
    assert blank == ""
    clipping = next(lines)
    return Highlight(title, dt, loc, clipping)


def parse_file(f):
    """
    Each clipping always consists of 5 lines:
    - title line
    - clipping info/metadata
    - a blank line
    - clipping text
    - a divider made up of equals signs
    Thus we can parse the clippings, and organise them by book.
    :return: organises kindle highlights by book .
    """
    for highlight in f.read().strip().split("=========="):
        yield parse_clipping(highlight)


@click.command()
@click.argument("src", type=click.File("rt"))
@click.argument("dest", type=click.File("wt"))
def run(src, dest):
    hs = [h for h in parse_file(src) if h is not None]
    print(len(hs))
    with open(HERE / "styles.css", mode="rt") as f:
        css = f.read()
    with open(HERE / "functions.js", mode="rt") as f:
        js = f.read()
    template = ENV.get_template("index.html")
    dest.write(
        template.render(
            highlights=sorted(hs, key=lambda h: h.dt, reverse=True),
            styles=f"<style>{css}</style>",
            script=f"<script type='module'>{js}</script>",
        )
    )


if __name__ == "__main__":
    run()
