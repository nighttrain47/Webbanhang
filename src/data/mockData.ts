export const mockProducts = [
  {
    id: '1',
    name: 'Miku Hatsune 1/7 Scale Figure',
    series: 'Vocaloid',
    manufacturer: 'Good Smile Company',
    price: 189000,
    image: 'https://images.unsplash.com/photo-1767955437721-83060c297305?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGZpZ3VyZSUyMGNvbGxlY3RpYmxlfGVufDF8fHx8MTc3MDM3OTI5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Scale Figures',
    status: 'Pre-order Open',
    rating: 4.8,
    specs: {
      material: 'PVC, ABS',
      size: 'Approx. 240mm',
      sculptor: 'Takayuki Kawahara',
      releaseDate: '2026/06/30'
    }
  },
  {
    id: '2',
    name: 'Rem: Crystal Dress Ver.',
    series: 'Re:Zero',
    manufacturer: 'Kadokawa',
    price: 225000,
    image: 'https://images.unsplash.com/photo-1760657061857-2dc900e0719e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2FsZSUyMG1vZGVsJTIwYW5pbWUlMjBjaGFyYWN0ZXJ8ZW58MXx8fHwxNzcwNDY3MjIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Scale Figures',
    status: 'In Stock',
    rating: 4.9,
    specs: {
      material: 'PVC',
      size: 'Approx. 260mm',
      sculptor: 'Shibuya Scramble Figure',
      releaseDate: '2026/03/15'
    }
  },
  {
    id: '3',
    name: 'Nendoroid Naruto Uzumaki',
    series: 'Naruto',
    manufacturer: 'Good Smile Company',
    price: 68000,
    image: 'https://images.unsplash.com/photo-1571760274608-115d883cd033?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW5kb3JvaWQlMjBmaWd1cmUlMjB0b3l8ZW58MXx8fHwxNzcwNDY3MjIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Nendoroid/Figma',
    status: 'In Stock',
    rating: 4.7
  },
  {
    id: '4',
    name: 'ONE PIECE Film Red Soundtrack',
    series: 'ONE PIECE',
    manufacturer: 'Avex Pictures',
    price: 42000,
    image: 'https://images.unsplash.com/photo-1587725979139-d84cad2ed442?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGNkJTIwYWxidW0lMjBtdXNpY3xlbnwxfHx8fDE3NzA0NjcyMjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Music & Goods',
    status: 'In Stock',
    rating: 5.0
  },
  {
    id: '5',
    name: 'Attack on Titan Acrylic Stand Set',
    series: 'Attack on Titan',
    manufacturer: 'Bandai',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1769479027867-817973e429af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMG1lcmNoYW5kaXNlJTIwZ29vZHN8ZW58MXx8fHwxNzcwNDY3MjIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Music & Goods',
    status: 'In Stock',
    rating: 4.5
  },
  {
    id: '6',
    name: 'Demon Slayer: Kimetsu no Yaiba Vinyl LP',
    series: 'Demon Slayer',
    manufacturer: 'Aniplex',
    price: 58000,
    image: 'https://images.unsplash.com/photo-1697652976142-899075a60572?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHZpbnlsJTIwcmVjb3JkfGVufDF8fHx8MTc3MDQ2NzIyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Music & Goods',
    status: 'Limited Edition',
    rating: 4.9
  }
];

export const bundleItems = [
  {
    id: 'bundle-cd',
    name: 'Original Soundtrack CD',
    image: 'https://images.unsplash.com/photo-1587725979139-d84cad2ed442?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGNkJTIwYWxidW0lMjBtdXNpY3xlbnwxfHx8fDE3NzA0NjcyMjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    price: 35000
  },
  {
    id: 'bundle-stand',
    name: 'Acrylic Character Stand',
    image: 'https://images.unsplash.com/photo-1769479027867-817973e429af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMG1lcmNoYW5kaXNlJTIwZ29vZHN8ZW58MXx8fHwxNzcwNDY3MjIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    price: 22000
  }
];
