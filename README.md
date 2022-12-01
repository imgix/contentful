<!-- ix-docs-ignore -->

![imgix logo](https://assets.imgix.net/sdk-imgix-logo.svg)

A Contentful app that integrates with imgix's [Asset Manager](https://docs.imgix.com/setup/asset-manager). Browse, search, and insert assets into your content quickly and easily. Simplify your content editing workflow within Contentful and empower your developers with imgix’s powerful image rendering and optimization service.

[![npm version](https://img.shields.io/npm/v/@imgix/contentful.svg)](https://www.npmjs.com/package/@imgix/contentful)
[![Build Status](https://circleci.com/gh/imgix/contentful.svg?style=shield)](https://circleci.com/gh/imgix/contentful)
[![Downloads](https://img.shields.io/npm/dm/@imgix/contentful.svg)](https://www.npmjs.com/package/@imgix/contentful)
[![License](https://img.shields.io/github/license/imgix/contentful.svg?color=informational)](https://github.com/imgix/contentful/blob/main/LICENSE.md)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fimgix%2Fcontentful.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fimgix%2Fcontentful?ref=badge_shield)

---

<!-- /ix-docs-ignore -->

<!-- NB: Run `npx markdown-toc README.md --maxdepth 4 | sed -e 's/[[:space:]]\{2\}/    /g'` to generate TOC, and copy the result from the terminal to replace the TOC below :) -->

<!-- prettier-ignore-start -->

<!-- toc -->

- [Installation](#installation)
- [Configuration](#configuration)
  - [Assign to Fields (Optional)](#assign-to-fields-optional)
- [Add to Content Model](#add-to-content-model)
- [Browse and Select Assets](#browse-and-select-assets)
- [Search for Assets](#search-for-assets)
- [Upload Assets](#upload-assets)
- [Query an Asset](#query-an-asset)
  - [Transforming Assets](#transforming-assets)
  - [Metadata](#metadata)
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

Upon installation, configure the app using an API key generated via the imgix [Dashboard](https://dashboard.imgix.com/api-keys). **Ensure that the generated key has the following permissions: `Sources` and `Asset Manager Browse`.**

Following the instructions on the screen, enter in the API key and press `Verify`. If the key is valid, you will receive a notification that the key has been successfully verified. If verification fails, you will need to ensure that the key was entered correctly.

<!-- ix-docs-ignore -->

https://user-images.githubusercontent.com/15919091/137049820-8ffc4bfd-43f1-41d2-b078-068ddaaa0c86.mp4

<!-- /ix-docs-ignore -->
<video controls width="800" height="600">
  <source src="https://user-images.githubusercontent.com/15919091/137049820-8ffc4bfd-43f1-41d2-b078-068ddaaa0c86.mp4">
</video>

### Assign to Fields (Optional)

The configuration page surfaces the option for users to select pre-existing content fields that are compatible with the imgix app. Note that the app is configured to integrate with `JSON object` fields only, therefore only fields of this type will be displayed. Users may prefer this method over selecting individual fields manually for each applicable content model.

<!-- ix-docs-ignore -->

https://user-images.githubusercontent.com/15919091/137056243-487233b5-228a-4f7b-bcd3-a99bed55f460.mp4

<!-- /ix-docs-ignore -->
<video controls width="800" height="600">
  <source src="https://user-images.githubusercontent.com/15919091/137056243-487233b5-228a-4f7b-bcd3-a99bed55f460.mp4">
</video>

## Add to Content Model

Of the many content types that users can choose from, imgix specifically integrates with the `JSON object`. Please note that if you are currently using a `Media` content type for images, you will need to create a new field of type `JSON object` to integrate the app with.
Designate a field to use imgix on by navigating to that field’s Appearance tab and selecting the app. This step can be skipped if you already [assigned the app](#assign-to-fields-optional) directly to the desired field(s).

<!-- ix-docs-ignore -->

https://user-images.githubusercontent.com/15919091/137056289-8ee117fa-c254-4ae9-93aa-0bea3b975d1b.mp4

<!-- /ix-docs-ignore -->
<video controls width="800" height="600">
  <source src="https://user-images.githubusercontent.com/15919091/137056289-8ee117fa-c254-4ae9-93aa-0bea3b975d1b.mp4">
</video>

## Browse and Select Assets

From any instance of a field using the imgix app, a modal can be opened to browse assets by imgix source. First, select a desired source to browse assets from. Using any of the pagination buttons, navigate each page of assets to choose from. After selecting an asset, it can be inserted to the field via the `Add asset` button. Additionally, there are options to replace an asset, or clear a selection from the field altogether.

<!-- ix-docs-ignore -->

https://user-images.githubusercontent.com/15919091/137056329-97e3536d-2bf3-471e-970a-2921fab44e8d.mp4

<!-- /ix-docs-ignore -->
<video controls width="800" height="600">
  <source src="https://user-images.githubusercontent.com/15919091/137056329-97e3536d-2bf3-471e-970a-2921fab44e8d.mp4">
</video>

## Search for Assets

The imgix app enables users to conduct a keyword search across assets in a source. Using the search box near the top of the modal will execute a search across multiple pre-determined fields: file origin path, asset tags, and categories. To learn more about these fields, see our Asset Manager [documentation](https://docs.imgix.com/setup/asset-manager#image-details).

<!-- ix-docs-ignore -->

https://user-images.githubusercontent.com/15919091/141595662-3a9a98fd-aa88-4e56-8d6f-c30a782c678b.mov

<!-- /ix-docs-ignore -->
<video controls width="800" height="600">
  <source src="https://user-images.githubusercontent.com/15919091/141595662-3a9a98fd-aa88-4e56-8d6f-c30a782c678b.mov">
</video>

## Upload Assets

The imgix app enables users to upload assets to a source. Using the "Upload" button near the top of the modal, users can select an image to upload to their desired source. Users change the upload source destination, filepath, or filename. To learn more about uploading, see our Asset Manager [documentation](https://docs.imgix.com/setup/asset-manager).

<!-- ix-docs-ignore -->
https://user-images.githubusercontent.com/16711614/205107815-9d576fd8-530a-41c0-99fa-0e3800b3e896.mp4

<!-- /ix-docs-ignore -->
<video controls width="800" height="600">
  <source src="https://user-images.githubusercontent.com/16711614/205107815-9d576fd8-530a-41c0-99fa-0e3800b3e896.mp4
">
</video>

## Query an Asset

Once the content is published, developers can query the `src` of the selected asset, returned as a string, via the Contentful API. The example below demonstrates this using GraphQL, but this can be done independent of any specific tool.

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

### Transforming Assets

Developers can leverage the power of imgix's [rendering API](https://docs.imgix.com/apis/rendering) downstream from where the asset was selected in Contentful. We recommend piping the value of the `src` field of the asset through to one of imgix's [SDKs](https://docs.imgix.com/libraries#frontend-libraries). The example below builds on the previous one by passing the image `src` through to [@imgix/gatsby](https://github.com/imgix/gatsby) component:

```js
import React from 'react';
import { graphql } from 'gatsby';
import { ImgixGatsbyImage } from '@imgix/gatsby';

export default function Page({ data }) {
  return data.allContentfulArticle.nodes.map(({ node }) => (
    <ImgixGatsbyImage
      src={node.avatar.src}
      imgixParams={{
        auto: 'format,compress',
        crop: 'faces,edges',
      }}
      layout="constrained"
      width={350}
      aspectRatio={16 / 9}
      sizes="(min-width: 1024px) calc(30vw - 128px), (min-width: 768px) calc(50vw - 100px), calc(100vw - 70px)"
      alt="An imgix-served image from Contentful"
    />
  ));
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

### Metadata
s
Users may also access metadata associated with an asset via the `attributes` field. Refer to the [imgix documentation](https://docs.imgix.com/setup/asset-manager#:~:text=per%20device/browser.-,Metadata,-This%20section%20displays) to learn more about the various types of metadata available on images and how to use them.

```graphql
query MyQuery {
  allContentfulArticle {
    nodes {
      bannerImage {
        src
        attributes {
          analyzed_content_warnings
          analyzed_faces
          analyzed_tags
          color_model
          color_profile
          content_type
          custom_fields
          date_created
          date_modified
          dpi_height
          dpi_width
          face_count
          file_size
          has_frames
          media_height
          media_kind
          media_width
          origin_path
          source_id
          tags
          uploaded_by_api
          warning_adult
          warning_medical
          warning_racy
          warning_spoof
          warning_violence
        }
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
          "bannerImage": {
            "src": "https://fourbottle.imgix.net/heroes/woman-stirring.jpg",
            "attributes": {
              "analyzed_content_warnings": true,
              "analyzed_faces": true,
              "analyzed_tags": true,
              "color_model": "RGB",
              "color_profile": "c2",
              "content_type": "image/jpeg",
              "custom_fields": "\"\"",
              "date_created": 1625796011,
              "date_modified": 1642786873,
              "dpi_height": 72,
              "dpi_width": 72,
              "face_count": 1,
              "file_size": 3411741,
              "has_frames": false,
              "media_height": 4000,
              "media_kind": "IMAGE",
              "media_width": 6000,
              "origin_path": "/heroes/woman-stirring.jpg",
              "source_id": "5f73d9798d5327eb5194d54a",
              "tags": "{\"Arm\":0.9448454976081848,\"Cup\":0.8950006365776062,\"Drinkware\":0.9177042841911316,\"Glasses\":0.9809675216674805,\"Hand\":0.9596579074859619,\"Joint\":0.9762823581695557,\"Photograph\":0.94278883934021,\"Shoulder\":0.9465579986572266,\"Tableware\":0.949840784072876,\"Vision care\":0.9289617538452148}",
              "uploaded_by_api": false,
              "warning_adult": 1,
              "warning_medical": 1,
              "warning_racy": 2,
              "warning_spoof": 1,
              "warning_violence": 1
            }
          }
        }
      ]
    }
  }
}
```

**Note**: Certain fields under `attributes` are returned as strings to provide better [resiliency](https://forums.fauna.com/t/how-to-store-arbitrary-json-object-via-graphql/142/3) when used with GraphQL. Therefore, these fields (`custom_fields`, `tags`, `colors.dominant_colors`) will need to be parsed back into JSON objects after being queried. The example below demonstrates how to do this:

```js
export default function Page({ data }) {
  return data.allContentfulArticle.edges.map(({ node }) => (
    <div className="p-4 lg:w-1/3 md:w-1/2 sm:w-full">
      <ImgixGatsbyImage
        src={node.bannerImage.src}
        imgixParams={{
          auto: 'format,compress',
          crop: 'faces,edges',
        }}
        layout="constrained"
        width={350}
        aspectRatio={16 / 9}
        sizes="(min-width: 1024px) calc(30vw - 128px), (min-width: 768px) calc(50vw - 100px), calc(100vw - 70px)"
        alt="An imgix-served image from Contentful"
      />
      {node.bannerImage.attributes.custom_fields ? (
        Object.entries(
          JSON.parse(node.bannerImage.attributes.custom_fields),
        ).map(([key, value]) => (
          <p>
            {key}: {value}
          </p>
        ))
      ) : (
        <br></br>
      )}
      {Object.entries(
        JSON.parse(node.bannerImage.attributes.colors.dominant_colors),
      ).map(([key, value]) => (
        <p>
          {key}: {value}
        </p>
      ))}
      {Object.entries(JSON.parse(node.bannerImage.attributes.tags)).map(
        ([key, value]) => (
          <p>
            {key}: {value}
          </p>
        ),
      )}
    </div>
  ));
}

export const query = graphql`
  {
    allContentfulArticle {
      edges {
        node {
          bannerImage {
            src
            attributes {
              custom_fields
              colors {
                dominant_colors
              }
              tags
            }
          }
        }
      }
    }
  }
`;
```

