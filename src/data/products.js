const products = [

  // ════════════════════════════
  //  MEN — SHOES
  // ════════════════════════════
  {
    id: 1,
    name: "Air Jordan 1 Retro High OG",
    gender: "men", type: "shoes", category: "Men's Shoes",
    price: 9999, tag: "Just In",
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80",
    description: "The shoe that started it all. Premium leather upper, Nike Air cushioning, and the iconic Wings logo on the ankle."
  },
  {
    id: 2,
    name: "Air Jordan 4 Retro",
    gender: "men", type: "shoes", category: "Men's Shoes",
    price: 12999, tag: "Best Seller",
    sizes: [7, 8, 8.5, 9, 9.5, 10, 11],
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    description: "Visible Air cushioning, mesh panels for breathability, and a plastic wing eyelet — the AJ4 is a timeless icon."
  },
  {
    id: 3,
    name: "Air Jordan 11 Retro",
    gender: "men", type: "shoes", category: "Men's Shoes",
    price: 14999, tag: "New",
    sizes: [8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80",
    description: "Patent leather mudguard, full-length Air unit, and carbon fiber shank plate. The most coveted Jordan ever made."
  },
  {
    id: 4,
    name: "Jordan Luka 2",
    gender: "men", type: "shoes", category: "Men's Shoes",
    price: 10499, tag: "Performance",
    sizes: [7, 7.5, 8, 9, 10, 11],
    image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600&q=80",
    description: "Built for Luka Doncic's game — quick cuts, deep threes, and relentless drives to the basket."
  },
  {
    id: 5,
    name: "Air Jordan 3 Retro",
    gender: "men", type: "shoes", category: "Men's Shoes",
    price: 11999, tag: "Iconic",
    sizes: [8, 8.5, 9, 9.5, 10, 11, 12],
    image: "https://images.unsplash.com/photo-1556906781-9a412961a28c?w=600&q=80",
    description: "The first Jordan designed by Tinker Hatfield. Elephant print overlays, a visible Air unit, and a Jumpman logo."
  },
  {
    id: 6,
    name: "Jordan Tatum 2",
    gender: "men", type: "shoes", category: "Men's Shoes",
    price: 9499, tag: null,
    sizes: [7, 8, 9, 10, 11],
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
    description: "Jayson Tatum's second signature shoe. Lightweight, responsive, and built for the modern game."
  },

  // ════════════════════════════
  //  MEN — CLOTHING
  // ════════════════════════════
  {
    id: 7,
    name: "Jordan Flight MVP T-Shirt",
    gender: "men", type: "clothing", category: "Men's Clothing",
    price: 2499, tag: "New",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    description: "100% cotton tee with a large Jumpman graphic on the chest. Relaxed fit, perfect for the gym or the streets."
  },
  {
    id: 8,
    name: "Jordan Essentials Fleece Hoodie",
    gender: "men", type: "clothing", category: "Men's Clothing",
    price: 5499, tag: "Best Seller",
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
    description: "Heavyweight 80% cotton fleece hoodie with a kangaroo pocket and embroidered Jumpman on the chest."
  },
  {
    id: 9,
    name: "Jordan Sport Dri-FIT Shorts",
    gender: "men", type: "clothing", category: "Men's Clothing",
    price: 3299, tag: null,
    sizes: ["S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=80",
    description: "Lightweight Dri-FIT fabric wicks sweat away. Elastic waistband with drawcord for a secure fit."
  },
  {
    id: 10,
    name: "Jordan Essentials Tracksuit Jacket",
    gender: "men", type: "clothing", category: "Men's Clothing",
    price: 6999, tag: "Just In",
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
    description: "Full-zip tracksuit jacket with side pockets and a Jumpman logo. Pairs perfectly with the matching pants."
  },
  {
    id: 11,
    name: "Jordan Jumpman Graphic Tee",
    gender: "men", type: "clothing", category: "Men's Clothing",
    price: 1999, tag: null,
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
    description: "Soft jersey tee with an all-over Jumpman print. A wardrobe staple for any Jordan fan."
  },
  {
    id: 12,
    name: "Jordan Sport Compression Tights",
    gender: "men", type: "clothing", category: "Men's Clothing",
    price: 2799, tag: null,
    sizes: ["S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80",
    description: "Dri-FIT compression tights with a Jumpman logo. Designed for high-intensity training."
  },

  // ════════════════════════════
  //  MEN — ACCESSORIES
  // ════════════════════════════
  {
    id: 13,
    name: "Jordan Jumpman Cap",
    gender: "men", type: "accessories", category: "Men's Accessories",
    price: 1999, tag: "Just In",
    sizes: ["One Size"],
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
    description: "Structured six-panel cap with an embroidered Jumpman logo. Adjustable strap for a perfect fit."
  },
  {
    id: 14,
    name: "Jordan Sport Backpack",
    gender: "men", type: "accessories", category: "Men's Accessories",
    price: 4999, tag: null,
    sizes: ["One Size"],
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    description: "30L capacity backpack with a padded laptop sleeve, multiple compartments, and Jumpman branding."
  },
  {
    id: 15,
    name: "Jordan Wristbands 2-Pack",
    gender: "men", type: "accessories", category: "Men's Accessories",
    price: 799, tag: null,
    sizes: ["One Size"],
    image: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&q=80",
    description: "Moisture-wicking terry cloth wristbands with the Jumpman logo. Built for performance."
  },
  {
    id: 16,
    name: "Jordan Gym Duffel Bag",
    gender: "men", type: "accessories", category: "Men's Accessories",
    price: 3499, tag: "New",
    sizes: ["One Size"],
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    description: "Spacious duffel with a separate shoe compartment, padded shoulder strap, and Jumpman logo."
  },
  {
    id: 17,
    name: "Jordan Crew Socks 3-Pack",
    gender: "men", type: "accessories", category: "Men's Accessories",
    price: 1299, tag: null,
    sizes: ["S", "M", "L"],
    image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&q=80",
    description: "Cushioned crew socks with arch support and a Jumpman logo. Pack of 3 pairs."
  },

  // ════════════════════════════
  //  WOMEN — SHOES
  // ════════════════════════════
  {
    id: 18,
    name: "Jordan Max Aura 5",
    gender: "women", type: "shoes", category: "Women's Shoes",
    price: 8499, tag: "New",
    sizes: [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8],
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
    description: "Street-ready style meets Air Max cushioning. Leather and mesh upper with a rubber outsole."
  },
  {
    id: 19,
    name: "Air Jordan 1 Low SE",
    gender: "women", type: "shoes", category: "Women's Shoes",
    price: 7999, tag: "Trending",
    sizes: [4, 5, 5.5, 6, 6.5, 7, 8],
    image: "https://images.unsplash.com/photo-1584735175315-9d5df23be620?w=600&q=80",
    description: "A low-cut take on the iconic AJ1. Designed with women's fit in mind, featuring premium leather and a cupsole."
  },
  {
    id: 20,
    name: "Air Jordan 1 Mid SE",
    gender: "women", type: "shoes", category: "Women's Shoes",
    price: 8999, tag: "Best Seller",
    sizes: [4, 4.5, 5, 6, 6.5, 7, 7.5, 8],
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80",
    description: "The mid-top AJ1 in women's exclusive colorways. Premium leather with Nike Air cushioning."
  },

  // ════════════════════════════
  //  WOMEN — CLOTHING
  // ════════════════════════════
  {
    id: 21,
    name: "Jordan Essentials Crop Top",
    gender: "women", type: "clothing", category: "Women's Clothing",
    price: 2199, tag: "New",
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    description: "Cropped fit with a relaxed feel. Soft cotton blend with a Jumpman logo on the chest."
  },
  {
    id: 22,
    name: "Jordan Flight Leggings",
    gender: "women", type: "clothing", category: "Women's Clothing",
    price: 3999, tag: "Best Seller",
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80",
    description: "High-waisted Dri-FIT leggings with a sleek Jumpman print down the leg. 7/8 length."
  },
  {
    id: 23,
    name: "Jordan Brooklyn Fleece Hoodie",
    gender: "women", type: "clothing", category: "Women's Clothing",
    price: 5999, tag: null,
    sizes: ["XS", "S", "M", "L"],
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80",
    description: "Oversized fleece hoodie with a bold Jordan graphic on the back. Dropped shoulders for a relaxed fit."
  },
  {
    id: 24,
    name: "Jordan Sport Bra",
    gender: "women", type: "clothing", category: "Women's Clothing",
    price: 2499, tag: "Just In",
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80",
    description: "Medium-support sports bra with Dri-FIT technology. Racerback design with a Jumpman logo."
  },
  {
    id: 25,
    name: "Jordan Woven Jacket",
    gender: "women", type: "clothing", category: "Women's Clothing",
    price: 6499, tag: null,
    sizes: ["XS", "S", "M", "L"],
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
    description: "Lightweight woven jacket with a full-zip front and side pockets. Perfect for layering."
  },

  // ════════════════════════════
  //  WOMEN — ACCESSORIES
  // ════════════════════════════
  {
    id: 26,
    name: "Jordan Futura Crossbody Bag",
    gender: "women", type: "accessories", category: "Women's Accessories",
    price: 3499, tag: "Just In",
    sizes: ["One Size"],
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    description: "Compact crossbody with an adjustable strap, zip closure, and iconic Jumpman branding."
  },
  {
    id: 27,
    name: "Jordan Headband",
    gender: "women", type: "accessories", category: "Women's Accessories",
    price: 699, tag: null,
    sizes: ["One Size"],
    image: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&q=80",
    description: "Soft stretch headband with moisture-wicking fabric. Keeps hair back during workouts."
  },
  {
    id: 28,
    name: "Jordan Jumpman Cap (Women's)",
    gender: "women", type: "accessories", category: "Women's Accessories",
    price: 1799, tag: "New",
    sizes: ["One Size"],
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
    description: "Women's fit cap with a Jumpman logo. Adjustable strap and a curved brim."
  },
  {
    id: 29,
    name: "Jordan Mini Backpack",
    gender: "women", type: "accessories", category: "Women's Accessories",
    price: 2999, tag: null,
    sizes: ["One Size"],
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    description: "Mini backpack with a main zip compartment and front pocket. Adjustable straps."
  },

  // ════════════════════════════
  //  KIDS — SHOES
  // ════════════════════════════
  {
    id: 30,
    name: "Air Jordan 1 Mid Kids",
    gender: "kids", type: "shoes", category: "Kids' Shoes",
    price: 5999, tag: "Best Seller",
    sizes: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80",
    description: "The iconic AJ1 silhouette scaled down for the next generation. Velcro strap for easy on/off."
  },
  {
    id: 31,
    name: "Jordan Kids Jumpman",
    gender: "kids", type: "shoes", category: "Kids' Shoes",
    price: 4999, tag: "New",
    sizes: [1, 2, 3, 4, 5, 5.5],
    image: "https://images.unsplash.com/photo-1556906781-9a412961a28c?w=600&q=80",
    description: "Lightweight and durable with a foam midsole. Built for active kids who move fast."
  },
  {
    id: 32,
    name: "Jordan Max Aura Kids",
    gender: "kids", type: "shoes", category: "Kids' Shoes",
    price: 4499, tag: "Just In",
    sizes: [1, 1.5, 2, 3, 4, 5],
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    description: "Cushioned comfort and bold Jordan style. Slip-on design with a bungee lace system."
  },

  // ════════════════════════════
  //  KIDS — CLOTHING
  // ════════════════════════════
  {
    id: 33,
    name: "Jordan Kids Jumpman Tee",
    gender: "kids", type: "clothing", category: "Kids' Clothing",
    price: 1499, tag: "New",
    sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80",
    description: "Soft and breathable cotton tee with a large Jumpman graphic. Easy care fabric."
  },
  {
    id: 34,
    name: "Jordan Kids Pullover Hoodie",
    gender: "kids", type: "clothing", category: "Kids' Clothing",
    price: 2999, tag: "Best Seller",
    sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
    image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=80",
    description: "Cozy fleece pullover with a kangaroo pocket and Jumpman logo. Great for school or play."
  },
  {
    id: 35,
    name: "Jordan Kids Shorts",
    gender: "kids", type: "clothing", category: "Kids' Clothing",
    price: 1799, tag: null,
    sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y"],
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=80",
    description: "Lightweight Dri-FIT shorts with an elastic waistband. Perfect for sports and play."
  },
  {
    id: 36,
    name: "Jordan Kids Tracksuit Set",
    gender: "kids", type: "clothing", category: "Kids' Clothing",
    price: 4499, tag: "Just In",
    sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
    description: "Matching jacket and pants set with Jumpman branding. Soft fleece lining for warmth."
  },

  // ════════════════════════════
  //  KIDS — ACCESSORIES
  // ════════════════════════════
  {
    id: 37,
    name: "Jordan Kids Backpack",
    gender: "kids", type: "accessories", category: "Kids' Accessories",
    price: 2499, tag: "Just In",
    sizes: ["One Size"],
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    description: "Durable backpack with a fun Jumpman print. Multiple compartments for school essentials."
  },
  {
    id: 38,
    name: "Jordan Kids Cap",
    gender: "kids", type: "accessories", category: "Kids' Accessories",
    price: 1299, tag: null,
    sizes: ["One Size"],
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
    description: "Adjustable snapback cap with a Jumpman logo. One size fits most kids."
  },
  {
    id: 39,
    name: "Jordan Kids Socks 3-Pack",
    gender: "kids", type: "accessories", category: "Kids' Accessories",
    price: 899, tag: null,
    sizes: ["S", "M"],
    image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&q=80",
    description: "Cushioned ankle socks with a Jumpman logo. Pack of 3 pairs in assorted colors."
  }
];

export default products;
