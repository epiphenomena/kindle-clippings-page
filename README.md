# kindle-clippings-page
Script to convert a kindle clippings file into a static readable webpage

Parses `My Clippings.txt`, which is where Kindle stores any highlights.
Then creates a static html file


## Quickstart

Connect kindle to computer via usb. "Open as" disk/folder. Copy `My Clippings.txt` to desired directory.

### Using uv (recommended)

This project uses [uv](https://github.com/astral-sh/uv) for dependency management and execution.

1. Install uv if you haven't already:
   ```bash
   pip install uv
   ```

2. Install dependencies:
   ```bash
   uv pip install -r requirements.txt
   ```

3. Run the script:
   ```bash
   uv run clippings.py /path/to/My\ Clippings.txt /path/to/save.html
   ```

### Using standard Python

If you prefer not to use uv:

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the script:
   ```bash
   python clippings.py /path/to/My\ Clippings.txt /path/to/save.html
   ```

Open html file in browser.



