# African Diaspora History Archive — GitHub Pages starter

A static, searchable archival catalogue designed to run entirely on GitHub Pages.

## How it works

- `data/records.json` is the catalogue database.
- `data/collections.json` controls collection cards.
- `assets/` stores digitised files or lightweight derivatives.
- `index.html` loads the JSON catalogue and provides keyword search + filters.
- `record.html?id=...` renders stable item-level catalogue pages.
- Every Git commit creates a versioned history of metadata changes.

## Add a new archive record

1. Upload the image/PDF/transcript to `assets/` (or use an external preservation/object-storage URL for large files).
2. Open `data/records.json`.
3. Copy an existing record object and change its fields.
4. Give it a unique stable `id` and `reference`.
5. Commit the changes.
6. GitHub Pages republishes the site from the configured branch.

## Recommended metadata fields

`id`, `title`, `date_display`, `year_start`, `year_end`, `collection`, `type`, `places`, `people`, `subjects`, `description`, `reference`, `source`, `rights`, `digital`, `file`, `image`.

For a serious archive, later add: creator, repository, language, transcription, provenance, acquisition, dimensions, format, citation, related_items, latitude/longitude, OCR text, IIIF manifest URL, Wikidata/VIAF authority IDs and sensitivity/access notes.

## Publish on GitHub Pages

1. Create a GitHub repository and add these files.
2. Repository → **Settings** → **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select `main` and `/ (root)` and save.
5. Your site will be available at `https://USERNAME.github.io/REPOSITORY/`.

The site uses relative URLs so it works correctly from a GitHub project-pages subdirectory.

## Scaling

This first version is intentionally serverless. For a few hundred to several thousand records, client-side JSON search is simple and cheap. For a much larger catalogue, move the metadata index to a dedicated search service (Typesense/Meilisearch/Algolia/OpenSearch) or generate a compact search index during GitHub Actions deployment.

Do not treat GitHub as the only preservation copy of irreplaceable archival masters. Keep redundant local/cloud backups and publish web derivatives. GitHub's browser upload has per-file limits and very large repositories become cumbersome.
