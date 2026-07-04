// ============================================================
//  config.js — YourApron Admin Settings
// ============================================================

const CONFIG = {

  // Who receives the design requests
  recipientEmail: '4yourapronhd@gmail.com',

  // Your Cash App $Cashtag (without $). Leave as 'YourCashtag' to hide the payment link.
  cashAppTag: 'YourApron',

  // Cash App email address for payment (shown in order summary & email).
  // Leave as 'YourCashAppEmail@example.com' to hide.
  cashAppEmail: '4yourapronhd@gmail.com',

  // Pricing per add-on (USD)
  pricing: {
    base:  0,   // Name only — always free
    title: 1,   // Title / Department
    icon:  1,   // Icon or uploaded image
    color: 1,   // Any non-default vinyl color
  },

  // Apron preview mode: 'css' = built-in orange badge, 'image' = your own photo
  apronMode: 'css',

  apronImage: {
    file:        'apron-preview.png',
    aspectRatio: 1.59,
    textArea:    { top: '35%', left: '10%', width: '80%' },
    nameColor:   '#ffffff',
    titleColor:  'rgba(255,255,255,0.65)',
  },

  // Vinyl color chips — first one is the default (free)
  vinylColors: [
    { label: 'White',      value: '#ffffff' },
    { label: 'Black',      value: '#1a1a1a' },
    { label: 'Red',        value: '#dc2626' },
    { label: 'Royal Blue', value: '#1d4ed8' },
    { label: 'Yellow',       value: '#eab308' },
    { label: 'Silver',     value: '#9ca3af' },
    { label: 'Green',      value: '#16a34a' },
    { label: 'Pink',       value: '#ec4899' },
  ],

  defaultVinylColor: '#ffffff',

  // Fonts shown in Company Picks tab
  companyFavourites: [
    'Bebas Neue',
    'Oswald',
    'Barlow Condensed',
    'Montserrat',
    'Dancing Script',
  ],

  // Fonts hidden from all tabs
  disabledFonts: [
'examplefont01',
'examplefont02',
]

};
