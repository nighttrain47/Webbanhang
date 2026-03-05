// Mock AmiAmi Product Data Service
// Trong thực tế, cần backend để scrape data từ AmiAmi do CORS policy

interface AmiAmiProduct {
  gcode: string;
  name: string;
  series: string;
  manufacturer: string;
  category: string;
  price: number;
  releaseDate: string;
  material: string;
  size: string;
  sculptor: string;
  description: string;
  imageUrl: string;
  sku: string;
}

// Mock database của các sản phẩm AmiAmi
const mockAmiAmiDatabase: Record<string, AmiAmiProduct> = {
  'FIGURE-197861': {
    gcode: 'FIGURE-197861',
    name: 'Hatsune Miku 1/7 Complete Figure - Racing Miku 2024 Ver.',
    series: 'Vocaloid',
    manufacturer: 'Good Smile Company',
    category: 'Figures',
    price: 4580000, // JPY converted to VND (approx 1 JPY = 170 VND)
    releaseDate: '2024-12-15',
    material: 'PVC, ABS',
    size: '240mm (1/7 Scale)',
    sculptor: 'Takayuki (Good Smile Company)',
    description: 'Mô hình Racing Miku phiên bản 2024 được sản xuất bởi Good Smile Company. Figure tỷ lệ 1/7 với chất lượng hoàn thiện cao cấp, tái hiện chi tiết trang phục racing đầy màu sắc và năng động.',
    imageUrl: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=400',
    sku: 'GSC-MIKU-2024'
  },
  'FIGURE-169420': {
    gcode: 'FIGURE-169420',
    name: 'Rem: Crystal Dress Ver. 1/7 Complete Figure',
    series: 'Re:Zero Starting Life in Another World',
    manufacturer: 'SHIBUYA SCRAMBLE FIGURE',
    category: 'Figures',
    price: 5950000,
    releaseDate: '2024-11-30',
    material: 'PVC, ABS',
    size: '265mm (1/7 Scale)',
    sculptor: 'Akabeko (Mimeyoi)',
    description: 'Rem trong bộ trang phục Crystal Dress lộng lẫy. Mô hình tỷ lệ 1/7 với hiệu ứng trong suốt tinh tế, tái hiện vẻ đẹp của nhân vật trong trang phục sang trọng.',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400',
    sku: 'SSF-REM-CD'
  },
  'FIGURE-145678': {
    gcode: 'FIGURE-145678',
    name: 'Nendoroid Nezuko Kamado',
    series: 'Demon Slayer: Kimetsu no Yaiba',
    manufacturer: 'Good Smile Company',
    category: 'Figures',
    price: 1530000,
    releaseDate: '2024-10-20',
    material: 'PVC, ABS',
    size: '100mm (Nendoroid)',
    sculptor: 'Nendoron',
    description: 'Nendoroid Nezuko Kamado từ series Demon Slayer. Đi kèm nhiều parts thay thế và phụ kiện, cho phép tạo ra nhiều pose và biểu cảm khác nhau.',
    imageUrl: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=400',
    sku: 'GSC-NEN-NEZ'
  },
  'FIGURE-123456': {
    gcode: 'FIGURE-123456',
    name: 'Asuka Langley 1/6 Complete Figure - Plug Suit Ver.',
    series: 'Evangelion',
    manufacturer: 'Kotobukiya',
    category: 'Figures',
    price: 5100000,
    releaseDate: '2025-01-15',
    material: 'PVC, ABS',
    size: '280mm (1/6 Scale)',
    sculptor: 'M.I.C. (Kotobukiya)',
    description: 'Asuka Langley trong trang phục Plug Suit mang tính biểu tượng. Mô hình tỷ lệ 1/6 với độ chi tiết cao, tái hiện hoàn hảo thiết kế từ Evangelion.',
    imageUrl: 'https://images.unsplash.com/photo-1608889175250-c3b0c1667d3a?w=400',
    sku: 'KTB-ASK-PS'
  },
  'GOODS-789012': {
    gcode: 'GOODS-789012',
    name: 'Spy x Family - Anya Forger Acrylic Stand',
    series: 'Spy x Family',
    manufacturer: 'Bandai',
    category: 'Goods',
    price: 510000,
    releaseDate: '2024-09-10',
    material: 'Acrylic',
    size: '150mm',
    sculptor: 'Official Merchandise',
    description: 'Acrylic stand chính hãng của Anya Forger từ series Spy x Family. Thiết kế dễ thương với chất liệu acrylic trong suốt cao cấp.',
    imageUrl: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=400',
    sku: 'BAN-SPY-ANY'
  },
  'CD-456789': {
    gcode: 'CD-456789',
    name: 'Attack on Titan - Final Season Original Soundtrack',
    series: 'Attack on Titan',
    manufacturer: 'Pony Canyon',
    category: 'CDs',
    price: 1190000,
    releaseDate: '2024-08-25',
    material: 'CD',
    size: 'Standard CD Case',
    sculptor: 'Music by Hiroyuki Sawano',
    description: 'Album nhạc phim chính thức của Attack on Titan Final Season. Bao gồm tất cả các bản nhạc nền nổi tiếng do Hiroyuki Sawano sáng tác.',
    imageUrl: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=400',
    sku: 'PC-AOT-OST'
  }
};

/**
 * Extracts product code (gcode) from AmiAmi URL
 * Example: https://www.amiami.com/eng/detail?gcode=FIGURE-197861
 */
export function extractGcodeFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const gcode = urlObj.searchParams.get('gcode');
    return gcode;
  } catch (error) {
    // Try regex fallback
    const match = url.match(/gcode=([A-Z0-9\-]+)/i);
    return match ? match[1] : null;
  }
}

/**
 * Simulates fetching product data from AmiAmi
 * In production, this would be a backend API call to scrape AmiAmi
 */
export async function fetchAmiAmiProduct(url: string): Promise<AmiAmiProduct> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const gcode = extractGcodeFromUrl(url);
  
  if (!gcode) {
    throw new Error('URL không hợp lệ. Vui lòng nhập đúng định dạng URL AmiAmi (VD: https://www.amiami.com/eng/detail?gcode=FIGURE-197861)');
  }

  const product = mockAmiAmiDatabase[gcode];
  
  if (!product) {
    throw new Error(`Không tìm thấy sản phẩm với mã ${gcode}. Vui lòng thử lại với một URL khác từ danh sách mock data có sẵn.`);
  }

  return product;
}

/**
 * Returns list of available mock products for testing
 */
export function getAvailableMockProducts(): string[] {
  return Object.keys(mockAmiAmiDatabase).map(gcode => 
    `https://www.amiami.com/eng/detail?gcode=${gcode}`
  );
}

/**
 * Validates if URL is an AmiAmi URL
 */
export function isValidAmiAmiUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('amiami.com') && urlObj.searchParams.has('gcode');
  } catch {
    return false;
  }
}
