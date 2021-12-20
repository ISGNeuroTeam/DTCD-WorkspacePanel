# DTCD-WorkspacePanel

Panel plugin of [DTCD](https://github.com/ISGNeuroTeam/DTCD) application that appear first on workspace system and uses for CRUD to workspaces.

## Getting Started

In order to use this plugin you need to download it, build and move build-file to _plugins_ folder on DTCD server.

### Prerequisites

- [node.js](https://nodejs.org/en/) LTS version 14.x.x
- [DTCD](https://github.com/ISGNeuroTeam/DTCD) v0.3.0
- `make` utility

### Building

```
make build
```

## Running the tests

```
make test
```

## Create build package

```
make pack
```

## Clear dependencies

```
make clean
```

## Deployment

Use `make pack` to get a deployable tarball. Move it to plugins directory and unarchive it with the following commands:

```
tar -zxf DTCD-WorkspacePanel-*.tar.gz ./DTCD-WorkspacePanel
```

## Built With

- [DTCD-SDK](https://github.com/ISGNeuroTeam/DTCD-SDK) v0.1.2
- [Rollup.js](https://rollupjs.org/guide/en/) - JavaScript project builder

## Contributing

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/ISGNeuroTeam/DTCD-WorkspacePanel/tags).

Also you can see the [CHANGELOG](CHANGELOG.md) file.

## Authors

- Roman Kuramshin (rkuramshin@isgneuro.com)

## License

This project is licensed under the OT.PLATFORM license agreement - see the [LICENSE](LICENSE.md) file for details

## Acknowledgments
