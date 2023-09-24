# Changelog

This document contains a summary of all significant changes made to this release.

## 🎉 Update v4.1.0

### Added

- Added refresh button on episode list, just incase if episodes isn't up to date
- Added manga list for Anilist user at homepage (will be available to guest user soon)
- Added ratelimit to API endpoint
- Watch Page
  - Added theater mode for more immersive viewing experience
  - Auto Play and Auto Next buttons are now included inside the player
  - Added bug report buttons to watch page (this bug report is still experimental and will be change/update in the near future)
  - Added share button to watch page
- For Developer (experimental)
  - Added Admin page for finding metadata for episodes
  - Added broadcast system (redis is required for this)

### Changed

- The navbar has seen significant enhancements, with the implementation of a single component for all pages.
- The watch page has been completely rewritten from scratch
- Implementing import aliases to significantly improve code readability and maintainability
