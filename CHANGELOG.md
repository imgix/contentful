# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.2](https://github.com/imgix/contentful/compare/v1.4.1...v1.4.2) (2024-08-29)

### Updates

- fix stringified values that are already strings

## [1.4.1](https://github.com/imgix/contentful/compare/v1.4.0...v1.4.1) (2024-06-20)

### Updates

- adds per-asset imgix parameter transformation checkboxes
- adds image width/height metadata
- adds default source configuration option
- allows dialog to be scrolled in smaller viewport

## [1.4.0](https://github.com/imgix/contentful/compare/v1.3.0...v1.4.0) (2022-12-12)

### Updates

- add loading spinner to source dropdown
- show loading spinner on source change
- load previously selected source after image select
- keep previously selected asset populated

### Fixes
- fix loading indicator when no assets present in source
- fix clear on click away

## [1.3.0](https://github.com/imgix/contentful/compare/v1.2.4...v1.3.0) (2022-12-01)
### Updates

- use grid-image placeholders
- create gallery placeholder component
- remove webfolder sources from upload sources
- display video frame as thumbnail
- add destination tooltip
- refresh image gallery on upload
- add fallback icon on error
- add svg icons for filetypes
- add icon component for SVG support
- disable upload button after click
- add upload success and error notifications
- disable button is webfolder source
- show upload indicator when uploading
- upload selected image to imgix source
- add upload handler function
- store destination path to state
- create upload modal
- create placeholder image url from file
- create upload button
- create action bar component
- add filename overlay to assets

### Bug Fixes

- populate the SourceDropdown with more sources

## [1.2.4](https://github.com/imgix/contentful/compare/v1.2.3...v1.2.4) (2022-11-16)

### Bug Fixes

- construct asset URL using Source `subdomain` instead of `name`

## [1.2.3](https://github.com/imgix/contentful/compare/v1.2.2...v1.2.3) (2022-10-24)

### Updates

- update dependencies
- change instances of "Image Manager" to "Asset Manager"

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
