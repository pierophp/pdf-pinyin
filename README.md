# PDF Pinyin

This project serves to extract the Pinyin from a PDF.

## Dependencies

Using docker all you need to do is run:

```
docker-compose build
```

### pdftotext

To install in a Linux enviroment

Debian / Ubuntu:

```
sudo apt-get install poppler-utils
```

Fedora / CentOS:

```
yum install poppler-utils
```

## Usage

### Docker

You can pass a URL with the PDF:

```
docker-compose run --rm pdf_pinyin ./run.sh http://mywebsite.com/myfile.pdf
```

Or you can save a file in the folder "data"

```
docker-compose run --rm pdf_pinyin ./run.sh myfile.pdf
```
