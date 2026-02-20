# Specification

## Summary
**Goal:** Build Scriptify Notes, a web-based application that converts typed or screenshot notes into realistic handwritten PDFs with sketch-style diagrams.

**Planned changes:**
- Implement image upload interface accepting PNG/JPG files up to 10MB with validation
- Integrate Tesseract.js for client-side OCR to extract structured text from screenshots
- Build handwriting rendering engine with randomized spacing, rotation (-2° to +2°), baseline shifts, and stroke thickness variations
- Create customization UI for ink color (blue/black) and paper backgrounds (ruled, graph, margin lines)
- Implement Canvas API-based image region detection to separate diagrams from text
- Build image-to-sketch conversion pipeline with grayscale, edge detection, adaptive threshold, noise, and pencil texture
- Generate A4 PDFs at 300 DPI using jsPDF or pdf-lib with multi-page support and line wrapping
- Create PDF preview screen with download functionality
- Integrate Internet Identity authentication for user sign-in
- Build Motoko backend for note storage with user ID, filename, and timestamp metadata
- Create note history interface displaying previously converted notes
- Design warm-colored, notebook-inspired UI with paper texture elements

**User-visible outcome:** Users can authenticate with Internet Identity, upload screenshot notes, customize handwriting style and paper appearance, preview AI-converted handwritten PDFs with sketch-style diagrams, download them locally, and view their conversion history.
