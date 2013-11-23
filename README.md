RoboMind Map Editor
-------------------

This is a complete HTML5 client-side tile-based map editor for the RoboMind
educational software program, found at www.robomind.net.

Features
========

It does (and demonstrates):

- Tile-based map editing (using Knockout.js)
- Loads local files (using the HTML5 FileReader API)
- Save files (using HTML5 `download` anchors)
- Encode entire application state in a compressed URL fragment (LZMA-JS)
- Undo (using encoded application state stack)

The application does not require any server-side support.

Installation
============

After cloning the repository, you'll need a web server to serve the files and
bower to download the dependencies. To get bower, you'll need Node.js, then
simply type:

    npm install -g bower

After that, run:

    bower install

From the clone directory and you're good to go.
