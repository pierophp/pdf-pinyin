# PDF Pinyin

The project goal is to extract the Pinyin from a PDF.

## Dependencies

Using docker all you need to do is run:

```
docker-compose build
```

If you don't want to use Docker please see: [README-NO-DOCKER.md](README-NO-DOCKER.md).

## Usage

You can pass a URL with the PDF:

```
docker-compose run --rm pdf_pinyin ./run.sh http://mywebsite.com/myfile.pdf convert.txt
```

Or you can save a file in the folder "data" and pass the filename

```
docker-compose run --rm pdf_pinyin ./run.sh myfile.pdf convert.txt
```

You need to pass as a second paramenter the filename with the content to convert (needs to be previous saved in the folder "data").

The response will be saved on a file add "result." as prefix and ".json" as suffix, in our example: "result.convert.txt.json".
