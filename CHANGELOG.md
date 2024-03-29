# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.13.0]

### Added

- path as query parameter in order to remember path in history

### Removed

- ability to delete folder inside it

## [0.12.0]

### Added

- role model for workspaces

### Fixed

- `getUserGroups()` method when groups are not received from the server

## [0.11.0]

### Fixed

- notification text of editing dashboard properties

## [0.10.0]

### Added

- length limit in description and title
- filter which cutting dashboard title
- tooltip to title

### Fixed

- notification text of import/export workspaces

## [0.9.0]

### Added

- error and success notifications

## [0.8.0]

### Fixed

- workspace color and icon not imported

## [0.7.0]

### Fixed

- redirect to root folder after editing subfolder
- drag and drop when importing dashboard file

## [0.6.1]

## Fixed

- convertion of workspce/folder names from utf8 to base64

## [0.6.0]

### Added

- publish of event of workspace delete
- logging of interactions with the server (deleting, creation, exporting, etc.)
- permissions creating, deleting, editing and reading elements

### Changed

- form settings for element

## Fixed

- workspace element colors are not applied or applied incorrectly

## [0.5.0]

### Added

- ability to create folders
- filtering and sorting desktop elements

### Changed

- updated functionality of the element creation modal window

### Fixed

- elements alphabet sorting color bug

## [0.4.0]

### Added

- panel header
- search workspace by name

### Removed

- button for adding elements from the list of elements

## [0.3.0]

### Added

- configuration support

### Changed

- dashboard list view

## [0.2.0]

### Added

- version of core systems for adapters

### Changed

- build process in order to make directory name with current version of pluing

## [0.1.1]

### Fixed

- SDK url

## [0.1.0]

### Added

- main functional
