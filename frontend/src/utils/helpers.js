export const buildWhatsAppLink = (number, productName, price) => {
  const clean = number.replace(/\D/g, '');
  const message = encodeURIComponent(
    `Hi! I'm interested in *${productName}* priced at ₹${price}. Could you please provide more details? 🌈`
  );
  return `https://wa.me/${clean}?text=${message}`;
};

export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

export const categoryMeta = {
  clove: {
    label:      'Clove',
    color:      '#92400E',
    bg:         '#FFF7ED',
    gradFrom:   '#ffd58c',
    gradTo:     '#B45309',
    cardBg:     'linear-gradient(145deg,#FFF7ED,#FDE68A,#FCD34D)',
    glowColor:  'rgba(245,158,11,0.5)',
    description:'Premium clove products',
    tagline:    "Where Scent Meets Innovation.",
    features: [
      { icon:'🌟', text:'Premium Quality Perfumes & Fragrances' },
      { icon:'✨', text:'Long-lasting Aromatic Experience' },
      { icon:'🔬', text:'Lab Tested & Certified Purity' },
      { icon:'💎', text:'Luxury Packaging — Perfect for Gifting' },
    ],
  },
  'i-fresh': {
    label:      'I-Fresh',
    color:      '#9D174D',
    bg:         '#FFF1F2',
    gradFrom:   '#F43F5E',
    gradTo:     '#BE185D',
    cardBg:     'linear-gradient(145deg,#FFF1F2,#FCE7F3,#FBCFE8)',
    glowColor:  'rgba(244,63,94,0.45)',
    description:'Fresh & natural range',
    tagline:    'Fresh skin, radiant you',
    features: [
      { icon:'🌸', text:'Floral Fragrance — Lasts All Day' },
      { icon:'🧴', text:'Skin Softening Formula with Aloe & Shea' },
      { icon:'🩺', text:'Dermatologist Tested & Approved' },
      { icon:'🌿', text:'Natural Ingredients — Zero Harmful Chemicals' },

    ],
  },
  cutebaby: {
    label:      'CuteBaby',
    color:      '#03185e',
    bg:         '#EFF6FF',
    gradFrom:   '#8db4f4',
    gradTo:     '#abbef0',
    cardBg:     'linear-gradient(145deg,#EFF6FF,#DBEAFE,#BFDBFE)',
    glowColor:  'rgba(59,130,246,0.45)',
    description:'Baby care essentials',
    tagline:    'Gentle care for your little one',
    features: [
      { icon:'👶', text:'Skin Friendly — Clinically Safe for Newborns' },
      { icon:'🧻', text:'Hygiene Wipes — Soft, Unscented & Alcohol-free' },
      { icon:'🌸', text:"Gentle on Baby's Sensitive Skin" },
      { icon:'🩺', text:'Dermatologist Tested & Paediatrician Approved' },


    ],
  },
  general: {
    label:      'General',
    color:      '#065F46',
    bg:         '#ECFDF5',
    gradFrom:   '#52ed8b',
    gradTo:     '#056c0f',
    cardBg:     'linear-gradient(145deg,#ECFDF5,#D1FAE5,#A7F3D0)',
    glowColor:  'rgba(16,185,129,0.45)',
    description:'Everyday essentials',
    tagline:    'Everything you need, every single day',
    features: [
      { icon:'🏠', text:'Everyday Essentials for Home & Family' },
      { icon:'💚', text:'Quality You Can Trust — Every Purchase' },
      { icon:'💰', text:'Best Value — Premium Quality at Fair Prices' },
      { icon:'📦', text:'Bulk Packs Available — Save More, Buy More' },
    ],
  },
};