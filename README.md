# publicapi

A new project using [Amber Framework](https://amberframework.org/)

## Installation

Install back-end and front-end dependencies.

```
shards install
npm install
```

Configure the `config/environments/development.yml` and set the `database_url` with your credentials to your database.

Then:

```
amber db create migrate
```

## Usage

### Development

To build crystal files:

```
amber watch
```

To build assets:

```
npm run watch
```

### Production

To setup `AMBER_ENV`:

```
export AMBER_ENV=production
```

To build a production release:
  
```
shards build --production --release publicapi
```

To build production assets:

```
npm run release
```

To use encrypted enviroment settings see [documentation](https://github.com/amberframework/online-docs/blob/master/getting-started/cli/encrypt.md#encrypt-command)

## Docker Compose

This will start an instance of postgres, migrate the database,
and launch the site at http://localhost:3000

```
docker-compose up -d
```

To view the logs:

```
docker-compose logs -f
```

> Note: The Docker images are compatible with Heroku.

## Contributing

1. Fork it ( https://github.com/your-github-user/publicapi/fork )
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create a new Pull Request

## Contributors

- [your-github-user](https://github.com/your-github-user) your-name-here - creator, maintainer
