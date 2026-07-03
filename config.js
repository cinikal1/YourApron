// ============================================================
//  config.js — Admin Configuration
//  Edit this file to customize the tool.
// ============================================================

const CONFIG = {

  // ── RECIPIENT EMAIL ───────────────────────────────────────
  // Who receives the font requests
  recipientEmail: 'nametags@yourcompany.com',

  // ── NAMETAG PREVIEW MODE ──────────────────────────────────
  // 'css'   → uses the built-in styled badge (no image needed)
  // 'image' → uses a local image file as the badge background
  nametagMode: 'css',

  // ── IMAGE MODE SETTINGS ───────────────────────────────────
  // Only relevant when nametagMode is 'image'
  nametagImage: {
    // Filename of your nametag image (place it in the same folder)
    file: 'nametag.png',

    // Aspect ratio of your image (width / height)
    // Common badge sizes:
    //   86mm × 54mm  → 1.59
    //   100mm × 70mm → 1.43
    //   90mm × 35mm  → 2.57
    aspectRatio: 1.59,

    // Where the name text sits on the image (as % of image size)
    // Adjust these until the text lands on the right spot
    textArea: {
      top:    '38%',   // distance from top of image
      left:   '8%',   // distance from left edge
      width:  '84%',  // width of the text area
    },

    // Name text styling on the image
    nameColor:  '#1a1917',   // text color
    titleColor: '#6b6a66',   // title/position color
  },

  // ── COMPANY FAVOURITES ────────────────────────────────────
  // These fonts appear in the "Company Picks" tab.
  // Must match exact Google Fonts names.
  companyFavourites: [
    'Montserrat',
    'Playfair Display',
    'Raleway',
    'Lora',
    'Josefin Sans',
  ],

};
