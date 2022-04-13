# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.2](https://github.com/imgix/contentful/compare/v1.2.1...v1.2.2) (2022-04-13)

### Bug Fixes

- optional chain when accessing editor interfaces and controls

### Updates

- adds in internal analytics to assist with future product improvements

## [1.2.1](https://github.com/imgix/contentful/compare/v1.2.0...v1.2.1) (2022-02-02)

### Bug Fixes

- do not access `dominant_colors` if parent object `colors` is undefined

## [1.2.0](https://github.com/imgix/contentful/compare/v1.1.0...v1.2.0) (2022-01-31)

### Features

- Add asset metadata to returned JSON object.

## [1.1.0](https://github.com/imgix/contentful/compare/v1.0.0...v1.1.0) (2021-11-12)

### Features

- Allow users to search across images in a source. Keyword searches will filter images by the following fields: file origin path, image tags, and user-defined categories.

## [1.0.0](https://github.com/imgix/contentful/compare/5ed04a4a6c07ce5596f25b7306b1c0df1a0de641...v1.0.0) (2021-10-08)

### Features

- Allow users to configure their app with an imgix API key
  - Add button to `Verify` user's key
  - Users can assign the imgix app to pre-existing `JSON object` fields at installation
- Modal from which users can select an imgix source to browse images from
- Pagination buttons for browsing multiple pages of assets
- `Add image` button saves the image `src` to the field value
- `Replace` button to replace an image
- `Remove` button to clear a selection
