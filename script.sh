#!/usr/bin/env bash
set -euo pipefail

mk() { mkdir -p "$(dirname "$1")"; : > "$1"; echo "created $1"; }

echo "=== Creating Anime UI scaffold (empty files) ==="

# ROOT: dedicated Anime UI namespace
mkdir -p src/components/ui/anime/{button,input,overlay,wrapper,other}

## BUTTONS (mirrors of global /ui/button/*, ready to override per anime)
mk src/components/ui/anime/button/BackButton.tsx
mk src/components/ui/anime/button/BackToTopButton.tsx
mk src/components/ui/anime/button/BookmarkButton.tsx
mk src/components/ui/anime/button/CopyButton.tsx
mk src/components/ui/anime/button/FullscreenToggleButton.tsx
mk src/components/ui/anime/button/IconButton.tsx
mk src/components/ui/anime/button/ShareButton.tsx
mk src/components/ui/anime/button/UserProfileButton.tsx

## INPUTS (anime-specific variants; keep names consistent for easy swaps)
mk src/components/ui/anime/input/GenresSelect.tsx
mk src/components/ui/anime/input/PasswordInput.tsx
mk src/components/ui/anime/input/SearchInput.tsx
mk src/components/ui/anime/input/SelectButton.tsx
mk src/components/ui/anime/input/ThemeSwitchDropdown.tsx

## OVERLAY (anime overrides; SearchModal already has a section variant, but add UI version too)
mk src/components/ui/anime/overlay/AdsWarning.tsx
mk src/components/ui/anime/overlay/ConfirmationModal.tsx
mk src/components/ui/anime/overlay/Disclaimer.tsx
mk src/components/ui/anime/overlay/Gallery.tsx
mk src/components/ui/anime/overlay/SearchModal.tsx
mk src/components/ui/anime/overlay/Trailer.tsx
mk src/components/ui/anime/overlay/VaulDrawer.tsx

## WRAPPER (carousel or future wrappers with anime theming)
mk src/components/ui/anime/wrapper/Carousel.tsx

## OTHER (utility display comps — mirrored to let you theme differently for anime)
mk src/components/ui/anime/other/Brand.tsx
mk src/components/ui/anime/other/BrandLogo.tsx
mk src/components/ui/anime/other/ContentTypeSelection.tsx
mk src/components/ui/anime/other/Genres.tsx
mk src/components/ui/anime/other/Loop.tsx
mk src/components/ui/anime/other/NavbarMenuItems.tsx
mk src/components/ui/anime/other/PhotosSection.tsx
mk src/components/ui/anime/other/PosterCardSkeleton.tsx
mk src/components/ui/anime/other/Rating.tsx
mk src/components/ui/anime/other/SearchFloatingBar.tsx
mk src/components/ui/anime/other/SectionTitle.tsx

echo "=== Done. Anime UI stubs created under src/components/ui/anime/* ==="
