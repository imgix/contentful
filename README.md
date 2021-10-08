<!-- ix-docs-ignore -->
![imgix logo](https://assets.imgix.net/sdk-imgix-logo.svg)

A Contentful app that integrates with imgix's [Image Manager](https://docs.imgix.com/setup/image-manager). Browse for, select and insert image assets into your content quickly and easily. Simplify your content editing workflow within Contentful and empower your developers with imgix’s powerful image rendering and optimization service.

[![Build Status](https://travis-ci.com/imgix/contentful.svg?branch=main)](https://travis-ci.com/imgix/contentful)
[![License](https://img.shields.io/github/license/imgix/contentful)](https://github.com/imgix/contentful/blob/main/LICENSE.md)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fimgix%2Fcontentful.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fimgix%2Fcontentful?ref=badge_shield)

---

<!-- /ix-docs-ignore -->

<!-- NB: Run `npx markdown-toc README.md --maxdepth 4 | sed -e 's/[[:space:]]\{2\}/    /g'` to generate TOC, and copy the result from the terminal to replace the TOC below :) -->

<!-- prettier-ignore-start -->

<!-- toc -->

- [Installation](#installation)
- [Configuration](#configuration)
    * [Assign to Fields](#assign-to-fields)
- [Add to Content Model](#add-to-content-model)
- [Browse and Select Images](#browse-and-select-images)
- [Query an Image's `src`](#query-an-images-src)
    * [Transforming Images](#transforming-images)
- [License](#license)

<!-- tocstop -->

<!-- prettier-ignore-end -->

## Installation

The app can installed to your Contentful workspace via the [marketplace](https://www.contentful.com/marketplace/app/imgix/).

If running locally, the app can be installed via npm:

```bash
npm install @imgix/contentful
npm run start
```

## Configuration

Upon installation, configure the app using an API key generated via the imgix [Dashboard](https://dashboard.imgix.com/api-keys). **Ensure that the generated key has the following permissions `Sources` and `Image Manager Browse`.**

Following the instructions on the screen, enter in the API key and press `Verify`. If the key is valid, you will receive a notification that the key has been successfully verified. If verification fails, you will need to ensure that the key was entered correctly.

https://user-images.githubusercontent.com/15919091/136624478-84830210-585d-40a3-9aa0-8540b4e67d7f.mov

### Assign to Fields

The configuration page surfaces the option for users to select pre-existing content fields that are compatible with the imgix app. Note that the app is configured to integrate with `JSON object` fields only, therefore only fields of this type will be displayed. Users may prefer this method over selecting individual fields manually for each applicable content model.

https://user-images.githubusercontent.com/15919091/136625503-aa4dabd4-5a7b-4886-912e-f536f7e67ab3.mov

## Add to Content Model

Of the many content types that users can choose from, imgix specifically integrates with the `JSON object`. Please note that if you are currently using a `Media` content type for images, you will need to create a new field of type `JSON object` to integrate the app with.
Designate a field to use imgix on by navigating to that field’s Appearance tab and selecting the app.

https://user-images.githubusercontent.com/15919091/136624966-717df2ec-f3fd-4e3c-aa0b-4ed1e7252e73.mov

## Browse and Select Images

From any instance of a field using the imgix app, a modal can be opened to browse images by imgix source. First, select a desired source to browse images from. Using any of the pagination buttons, navigate each page of assets to choose from. After selecting an image, it can be inserted to the field via the `Add image` button. Additionally, there are options to replace an image, or clear a selection from the field altogether.

https://user-images.githubusercontent.com/15919091/136625073-6c109568-7b8b-490f-aa2f-4be12bbc2cb0.mov

## Query an Image's `src`

Once content is published, developers can query the `src` of the selected image via the Contentful API. The example below demonstrates this using GraphQL in a Gatsby site, but this can be done independent of any specific site builder or stack.

### Transforming Images

Developers can leverage the power of imgix's [rendering API](https://docs.imgix.com/apis/rendering) downstream from where the image was selected in Contentful. We recommend piping the `src` field of the image through to one of imgix's [SDKs](https://docs.imgix.com/libraries). The example below builds on the previous one by passing the image `src` through to [react-imgix](https://github.com/imgix/react-imgix):

## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fimgix%2Fcontentful.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fimgix%2Fcontentful?ref=badge_large)
