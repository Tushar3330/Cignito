// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from "next-sanity";
import { client } from './client'
import "server-only";

export const { sanityFetch, SanityLive } = defineLive({ 
  client: client.withConfig({ 
    // Live content is currently only available on the experimental API
    // https://www.sanity.io/docs/api-versioning
    apiVersion: process.env.SANITY_API_VERSION || 'v2024-06-07'
  }),
  // Only show published content (no draft previews)
  serverToken: false,
  // Disable browser token (only works in Sanity Studio)
  browserToken: false,
});
