// Multi-Vendor StreetByte Natural Language & Vernacular Parser
import { getAllMenuItems, VENDORS } from '../config/menuData';

const NUMBER_WORDS = {
  'one': 1, 'a': 1, 'an': 1, 'single': 1,
  'two': 2, 'pair': 2, 'double': 2,
  'three': 3, 'triple': 3,
  'four': 4,
  'five': 5,
  'six': 6,
  'seven': 7,
  'eight': 8,
  'nine': 9,
  'ten': 10
};

export function parseOrderText(input, activeVendorId = null) {
  if (!input || typeof input !== 'string') return null;

  const raw = input.toLowerCase();
  const allItems = getAllMenuItems();
  const detectedItems = [];
  let detectedSpice = 'medium';
  let detectedOnions = 'standard';
  let detectedPackaging = 'foil';

  // 1. Detect Spice preference
  if (raw.includes('extra pepper') || raw.includes('fire') || raw.includes('hot hot') || raw.includes('plenty yaji') || raw.includes('very spicy') || raw.includes('plenty pepper') || raw.includes('extra spicy')) {
    detectedSpice = 'fire';
  } else if (raw.includes('mild') || raw.includes('small pepper') || raw.includes('no pepper') || raw.includes('not too hot') || raw.includes('little pepper') || raw.includes('sweet pepper')) {
    detectedSpice = 'mild';
  }

  // 2. Detect Onions preference
  if (raw.includes('no onion') || raw.includes('without onion') || raw.includes('remove onion') || raw.includes('zero onion')) {
    detectedOnions = 'none';
  } else if (raw.includes('onion on the side') || raw.includes('onions aside') || raw.includes('separate onion') || raw.includes('side onion')) {
    detectedOnions = 'side';
  }

  // 3. Detect Packaging
  if (raw.includes('foil') || raw.includes('keep warm') || raw.includes('silver') || raw.includes('takeaway container')) {
    detectedPackaging = 'foil';
  }

  // 4. Match Items
  // Prioritize active vendor items if supplied, otherwise search all vendors
  allItems.forEach(item => {
    let matched = false;

    if (raw.includes(item.name.toLowerCase())) {
      matched = true;
    } else {
      for (const kw of item.popularKeywords) {
        const regex = new RegExp(`\\b${kw}\\b`, 'i');
        if (regex.test(raw)) {
          matched = true;
          break;
        }
      }
    }

    if (matched) {
      const qty = extractQuantity(raw, item);
      detectedItems.push({
        item,
        quantity: qty > 0 ? qty : 1,
        vendorId: item.vendorId,
        customizations: item.customizable ? {
          spice: detectedSpice,
          onions: detectedOnions,
          packaging: detectedPackaging
        } : null
      });
    }
  });

  // Calculate totals
  const subtotal = detectedItems.reduce((acc, curr) => acc + (curr.item.price * curr.quantity), 0);
  const totalPrepTime = detectedItems.length > 0 ? Math.max(...detectedItems.map(d => d.item.prepTime)) : 8;

  // Primary vendor determination
  const primaryVendorId = detectedItems.length > 0 
    ? detectedItems[0].vendorId 
    : (activeVendorId || 'musa-suya');
  const targetVendor = VENDORS.find(v => v.id === primaryVendorId) || VENDORS[0];

  // Smart suggestions
  let smartSuggestion = null;
  if (detectedItems.length > 0) {
    const hasDrink = detectedItems.some(d => d.item.category === 'drinks');
    if (!hasDrink) {
      if (primaryVendorId === 'musa-suya') {
        const malt = targetVendor.menuItems.find(i => i.id === 'item-malt');
        smartSuggestion = {
          text: "Suya heat is serious! Add an ice-cold Chilled Malt (₦700) or Fresh Zobo (₦500)?",
          upsellItem: malt
        };
      } else {
        const chapman = targetVendor.menuItems.find(i => i.id === 'item-chapman');
        smartSuggestion = {
          text: "Party jollof goes best with Mama Blessing's signature chilled Chapman (₦1,000)!",
          upsellItem: chapman
        };
      }
    }
  }

  return {
    rawInput: input,
    detectedItems,
    primaryVendorId,
    targetVendor,
    subtotal,
    prepTimeMinutes: totalPrepTime,
    spice: detectedSpice,
    onions: detectedOnions,
    packaging: detectedPackaging,
    smartSuggestion,
    confidence: detectedItems.length > 0 ? 'high' : 'low'
  };
}

function extractQuantity(text, item) {
  const words = text.split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    const word = words[i].replace(/[^a-z0-9]/gi, '');
    const isKeyword = item.popularKeywords.some(kw => kw.includes(word));
    if (isKeyword && i > 0) {
      const prevWord = words[i - 1].replace(/[^a-z0-9]/gi, '');
      if (!isNaN(parseInt(prevWord, 10))) {
        return parseInt(prevWord, 10);
      }
      if (NUMBER_WORDS[prevWord]) {
        return NUMBER_WORDS[prevWord];
      }
    }
  }

  const regexNum = new RegExp(`(\\d+)\\s*(?:x|packs?|portions?|sticks?|plates?)?\\s*(?:of\\s*)?(?:${item.popularKeywords.join('|')})`, 'i');
  const match = text.match(regexNum);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }

  return 1;
}
