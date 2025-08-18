# kindle-clippings-page
Script to convert a kindle clippings file into a static readable webpage

Parses `My Clippings.txt`, which is where Kindle stores any highlights.
Then creates a static html file


## Quickstart

Connect kindle to computer via usb. "Open as" disk/folder. Copy `My Clippings.txt` to desired directory.

This project uses [uv](https://github.com/astral-sh/uv) for dependency management and execution.

1. Install uv if you haven't already:

2. Run the script:
   ```bash
   uv run clippings.py /path/to/My\ Clippings.txt /path/to/save.html
   ```

3. Or make clippings.py executable and simply `clippings.py /path/to/My\ Clippings.txt /path/to/save.html`

4. Open html file in browser.


The HTML is completely self-contained. The styles.css and functions.js files are inlined.
Therefore, no web server is required to open locally, and the single output file
is all that needs to be uploaded if hosting is desired.