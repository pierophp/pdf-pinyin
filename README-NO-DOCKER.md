# PDF Pinyin

The project goal is to extract the Pinyin from a PDF.

To add to your project:

YARN:

```
yarn add pdf-pinyin
```

NPM:

```
npm install pdf-pinyin
```

## Dependencies

### pdftotext

To install in a Linux environment:

Debian / Ubuntu:

```
sudo apt-get install poppler-utils
```

Fedora / CentOS:

```
yum install poppler-utils
```

### Node Modules

YARN:

```
yarn install
```

NPM:

```
npm install
```

## Usage

You can pass a URL with the PDF:

```
node index.js http://mywebsite.com/myfile.pdf convert.txt
```

Or you can save a file in the folder "data" and pass the filename

```
node index.js myfile.pdf convert.txt
```

You need to pass as a second paramenter the filename with the content to convert (needs to be previous saved in the folder "data").

The response will be saved on a file add "result." as prefix and ".json" as suffix, in our example: "result.convert.txt.json".
