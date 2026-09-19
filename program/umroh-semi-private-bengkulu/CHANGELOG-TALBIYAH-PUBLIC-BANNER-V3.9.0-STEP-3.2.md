# V3.9.0 Step 3.2 — Talbiyah Public Banner + Static Social Metadata

Status: Pilot patch for the Talbiyah Manasik page.

## Changed

- Adds the current Talbiyah R2 public banner below the existing lesson hero without replacing the established visual identity.
- Adds reusable responsive `.lesson-media` styles to `assets/css/manasik.css`.
- Adds `og:image`, `og:image:secure_url`, image type/dimensions/alt, `twitter:image`, `twitter:image:alt`, and upgrades Twitter card to `summary_large_image` in the static Talbiyah HTML head.
- Adds the public banner URL to the Talbiyah `Article` JSON-LD `image` property.
- Extends the public `GET /manasik/materials/:material_key` response with the matching `umroh_page_meta` record.
- Updates `manasik-content.js` so the visible lesson banner can refresh from D1 metadata at runtime while the static HTML remains a crawler/no-JavaScript fallback.

## Preserved

- Existing hero, lesson content, progress, previous/next navigation, authentication, and Admin workflows.
- Public media stays in the dedicated `PUBLIC_MEDIA` R2 bucket.
- Private Jamaah document storage remains separate.
- Platform version remains V3.8.0 until the complete V3.9.0 release is verified and locked.

## Current Talbiyah media

- Banner / social image: `https://media-umroh.srilexbuditra.work/manasik/talbiyah/banner-0a240dba-93d6-4116-8233-68b9210c2355.avif`
- Alt: `Materi Manasik Talbiyah Umroh Semi Private Bengkulu`
- Caption: `Materi Manasik Digital — Bacaan Talbiyah`

## Deployment

1. Copy the `program` folder to the repository root and replace matching files.
2. Deploy `program/umroh-semi-private-bengkulu/backend/worker/worker.js` to `umroh-auth-api` without changing bindings/secrets.
3. Commit and push the repository files.
4. Hard refresh the Talbiyah page and verify the banner, social meta head, and public material API response.
