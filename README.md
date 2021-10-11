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
    * [Assign to Fields (Optional)](#assign-to-fields-optional)
- [Add to Content Model](#add-to-content-model)
- [Browse and Select Images](#browse-and-select-images)
- [Query an Image](#query-an-image)
    * [Transforming Images](#transforming-images)
- [License](#license)

<!-- tocstop -->

<!-- prettier-ignore-end -->

## Installation

The app can be installed to your Contentful workspace via the [marketplace](https://www.contentful.com/marketplace/app/imgix/).

If running locally, the app can be installed via npm:

```bash
npm install @imgix/contentful
npm run start
```

## Configuration

Upon installation, configure the app using an API key generated via the imgix [Dashboard](https://dashboard.imgix.com/api-keys). **Ensure that the generated key has the following permissions: `Sources` and `Image Manager Browse`.**

Following the instructions on the screen, enter in the API key and press `Verify`. If the key is valid, you will receive a notification that the key has been successfully verified. If verification fails, you will need to ensure that the key was entered correctly.

https://user-images.githubusercontent.com/15919091/136624478-84830210-585d-40a3-9aa0-8540b4e67d7f.mov

### Assign to Fields (Optional)

The configuration page surfaces the option for users to select pre-existing content fields that are compatible with the imgix app. Note that the app is configured to integrate with `JSON object` fields only, therefore only fields of this type will be displayed. Users may prefer this method over selecting individual fields manually for each applicable content model.

https://user-images.githubusercontent.com/15919091/136625503-aa4dabd4-5a7b-4886-912e-f536f7e67ab3.mov

## Add to Content Model

Of the many content types that users can choose from, imgix specifically integrates with the `JSON object`. Please note that if you are currently using a `Media` content type for images, you will need to create a new field of type `JSON object` to integrate the app with.
Designate a field to use imgix on by navigating to that field’s Appearance tab and selecting the app. This step can be skipped if you already [assigned the app](#assign-to-fields-optional) directly to the desired field(s).

https://user-images.githubusercontent.com/15919091/136624966-717df2ec-f3fd-4e3c-aa0b-4ed1e7252e73.mov

## Browse and Select Images

From any instance of a field using the imgix app, a modal can be opened to browse images by imgix source. First, select a desired source to browse images from. Using any of the pagination buttons, navigate each page of assets to choose from. After selecting an image, it can be inserted to the field via the `Add image` button. Additionally, there are options to replace an image, or clear a selection from the field altogether.

https://user-images.githubusercontent.com/15919091/136625073-6c109568-7b8b-490f-aa2f-4be12bbc2cb0.mov

## Query an Image

Once the content is published, developers can query the `src` of the selected image, returned as a string, via the Contentful API. The example below demonstrates this using GraphQL, but this can be done independent of any specific tool.

```graphql
query MyQuery {
  allContentfulArticle {
    nodes {
      avatar {
        src
      }
      bannerImage {
        src
      }
    }
  }
}
```

returns something similar to:

```json
{
  "data": {
    "allContentfulArticle": {
      "nodes": [
        {
          "avatar": {
            "src": "https://fourbottle.imgix.net/heroes/pourover.jpg"
          },
          "bannerImage": {
            "src": "https://fourbottle.imgix.net/heroes/light-scatter.jpg"
          }
        }
      ]
    }
  },
  "extensions": {}
}
```

### Transforming Images

Developers can leverage the power of imgix's [rendering API](https://docs.imgix.com/apis/rendering) downstream from where the image was selected in Contentful. We recommend piping the value of the `src` field of the image through to one of imgix's [SDKs](https://docs.imgix.com/libraries#frontend-libraries). The example below builds on the previous one by passing the image `src` through to [@imgix/gatsby](https://github.com/imgix/gatsby) component:

```js
import React from "react";
import { graphql } from "gatsby";
import { ImgixGatsbyImage } from "@imgix/gatsby";

export default function Page({ data }) {
  return (
    data.allContentfulArticle.nodes.map(({ node }) => (
        <ImgixGatsbyImage
          src={node.avatar.src}
          imgixParams={{
            auto: "format,compress",
            crop: "faces,edges",
          }}
          layout="constrained"
          width={350}
          aspectRatio={16 / 9}
          sizes="(min-width: 1024px) calc(30vw - 128px), (min-width: 768px) calc(50vw - 100px), calc(100vw - 70px)"
          alt="An imgix-served image from Contentful"
        />
    ))
  );
}

export const query = graphql`
query MyQuery {
  allContentfulArticle {
    nodes {
      avatar {
        src
      }
    }
  }
}
`;
```

## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fimgix%2Fcontentful.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fimgix%2Fcontentful?ref=badge_large)
