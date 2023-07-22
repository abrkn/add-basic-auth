# add-basic-auth

Protect a resource with basic auth

## Installing

`npm install add-basic-auth`

## Usage

```
Options:
  --help        Show help                                              [boolean]
  --version     Show version number                                    [boolean]
  --target                                                            [required]
  --listenPort                                          [required] [default: 80]
  --username                    [required] [default: process.env.PROXY_USERNAME]
  --password                    [required] [default: process.env.PROXY_PASSWORD]
  --targetPort                                                     [default: 80]

Examples:
  add-basic-auth --listenPort 3001 --username foo --password bar --target
  http://brekken.com
```

## License

See [LICENSE](LICENSE)
