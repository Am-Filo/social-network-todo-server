# Network Server

npm version: `6.13.4`
node version: `12.16.0`

## Installation

1. Setup your `env` configuration

- Create `.env` file in main folder
- Copy example file configuration from `.env-example` file

2. Install packages

- To install all dependency and packages use command

```sh
npm install
```

## Usage example

1. Run application

- To start server use command

```sh
npm run start
```

2. More options

- To drop database and restart server (if you have different database name rename database in `package.json`) use command

```sh
npm run rebuildDB
```

_For more examples and usage, please refer to the [Wiki][wiki]._

## Development setup

```sh
npm install
npm run start
```

## Release History

- 0.2.0
  - ADDED: Subscribe to new user
  - Fix some problems
- 0.1.0
  - First Release
  - ADDED: users schema, added fuctions create,delete and update user information
  - ADDED: profile for users (basic user information include username and etc..)
  - ADDED: settings for users (basic user settings added to user profile)
  - ADDED: authentication middleware (protected queries and routes by checking user authenticated status)
  - ADDED: login and logout (routes thats provide users to login and logout from application)
  - Init todo list and items (connect todo list to user profile)
- 0.0.1
  - Init project

## Meta

Amary Filo – [@lamiqv](https://twitter.com/lamiqv) – lamiqv@gmail.com

Distributed under the MIT license. See `LICENSE` for more information.

[https://github.com/Am-Filo/social-network-todo-server](https://github.com/Am-Filo/social-network-todo-server)

## Contributing

1. Fork it (<https://github.com/Am-Filo/social-network-todo-server/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`) or use gitflow (`git flow feature start fooBar`)
3. Commit your changes (`git commit -am 'Magic commit'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

[wiki]: https://github.com/Am-Filo/social-network-todo-server/wiki
