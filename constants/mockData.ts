export interface Category {
  id: number;
  name: string;
  image_url: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  old_price?: number;
  stock: number;
  category_id: number;
  image_url: string;
  rating: number;
  reviews: number;
}

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Farmacia',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Belleza',
    image_url: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=500&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Cuidado Personal',
    image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop',
  },
  {
    id: 4,
    name: 'Bebés',
    image_url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500&auto=format&fit=crop',
  },
  {
    id: 5,
    name: 'Alimentos',
    image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop',
  }
];

export const MOCK_PRODUCTS: Product[] = [
  // Farmacia (Category 1)
  {
    id: 101,
    name: 'Vitamina C Premium 1000mg',
    description: 'Refuerza tu sistema inmunológico con vitamina C de alta pureza.',
    price: 15.99,
    old_price: 19.99,
    stock: 50,
    category_id: 1,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRnxfSuzlgSwZb68Y9_IbD7X72hIx8gnqEAY3mwaeEyVKr0Z5E9AJN-P0ViXAPGpnN62Y5SXZq04R8YHNNT_ZWTTvbFQ1peYdh9aU5yomfbuJj2ZO1BdsiF8NHE2gHnUwwj3zdzIQWpzp3_pDOECuT3OqqjhgJjPnMMwCUW1mWS4v2-tE0KAoHfaAoyC4UbEUXcom5uyt6XYNicB-KsGamS8mUwyOM8vgdY2ImmtppDs_1_TXeYu3WgJx5iLjSo9xhs1u5ViCLGDLy',
    rating: 4.8,
    reviews: 124
  },
  {
    id: 102,
    name: 'Paracetamol 500mg - 20 Tabletas',
    description: 'Alivio rápido para el dolor de cabeza y la fiebre.',
    price: 4.50,
    stock: 200,
    category_id: 1,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop',
    rating: 4.5,
    reviews: 89
  },

  // Belleza (Category 2)
  {
    id: 201,
    name: 'Serum Ácido Hialurónico',
    description: 'Hidratación profunda para una piel radiante y sin arrugas.',
    price: 28.90,
    old_price: 35.00,
    stock: 30,
    category_id: 2,
    image_url: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=500&auto=format&fit=crop',
    rating: 4.9,
    reviews: 210
  },
  {
    id: 202,
    name: 'Base de Maquillaje Mate',
    description: 'Cobertura total con acabado mate natural que dura 24 horas.',
    price: 22.50,
    stock: 45,
    category_id: 2,
    image_url: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=500&auto=format&fit=crop',
    rating: 4.6,
    reviews: 156
  },

  // Cuidado Personal (Category 3)
  {
    id: 301,
    name: 'Shampoo Anticaída con Biotina',
    description: 'Fortalece la raíz del cabello previniendo la caída severa.',
    price: 12.99,
    stock: 80,
    category_id: 3,
    image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop',
    rating: 4.7,
    reviews: 95
  },

  // Bebés (Category 4)
  {
    id: 401,
    name: 'Pañales Premium Talla G',
    description: 'Pañales ultra absorbentes con indicador de humedad. Paquete de 40.',
    price: 18.50,
    old_price: 22.00,
    stock: 120,
    category_id: 4,
    image_url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500&auto=format&fit=crop',
    rating: 4.8,
    reviews: 320
  },

  // Alimentos (Category 5)
  {
    id: 501,
    name: 'Cereal Integral con Frutos Rojos',
    description: 'Desayuno nutritivo alto en fibra para empezar bien el día.',
    price: 6.99,
    stock: 150,
    category_id: 5,
    image_url: 'https://images.unsplash.com/photo-1521404457788-b21a30faad96?w=500&auto=format&fit=crop',
    rating: 4.4,
    reviews: 67
  }
];
