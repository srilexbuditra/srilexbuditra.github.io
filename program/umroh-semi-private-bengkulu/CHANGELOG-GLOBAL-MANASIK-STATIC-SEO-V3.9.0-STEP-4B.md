# V3.9.0 Step 4B — Global Manasik Static SEO & Optional Banner

## Scope
Applies the Talbiyah metadata foundation to the other 10 public Manasik lesson pages.

## Added
- Static `index,follow`, canonical, description, author and theme metadata.
- Open Graph locale/type/title/description/url/site name.
- Twitter title/description with `summary` fallback while no social image is published.
- `Article` JSON-LD and `BreadcrumbList` JSON-LD on every lesson page.
- Runtime optional banner support via the shared `manasik-content.js`; no empty banner box is rendered when `banner_url` is empty.

## Media behavior
- Talbiyah remains the completed image pilot and is unchanged by this patch.
- The other 10 lessons do not hard-code an image until one is explicitly published.
- Uploading a banner through Admin can render it at runtime from D1/R2.
- Social crawlers require a later static publish/update to place a newly uploaded image URL into the HTML `<head>`.

## Safety
- Does not change Manasik material keys, order, progress storage, authentication, D1 schema, Worker bindings, or Jamaah progress.
