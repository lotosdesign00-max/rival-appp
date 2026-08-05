import { CaseStudy, UpdateItem, Course, Review, RenderTask, GalleryItem } from '../types';


export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-nova',
    title: 'Project Nova',
    categoryLabel: 'БАННЕР',
    categoryKey: 'banners',
    image: '/src/assets/images/project_nova_banner_1785589463136.jpg',
    isFeatured: true,
    tag: 'FEATURED',
    description: 'Neon cyberpunk interface banner with interactive HUD elements, circuit vector graphs and glow shaders.',
    software: 'Figma + Cinema4D + Octane',
    resolution: '1024 × 1280 (Mockup HQ)',
    views: 18420,
    likes: 2190,
    date: '2026-07-31',
    author: 'Rival Studio Team'
  },
  {
    id: 'g-cyber-ninja',
    title: 'Cyber Ninja',
    categoryLabel: 'АВАТАР',
    categoryKey: 'avatars',
    image: '/src/assets/images/cyber_ninja_avatar_1785589476815.jpg',
    isFeatured: false,
    tag: 'DESIGNER PORTFOLIO',
    description: '3D mechanical futuristic helmet with purple neon glowing visor and metallic carbon textures.',
    software: 'ZBrush + Blender Cycles',
    resolution: '1024 × 1280 (Mockup HQ)',
    views: 12500,
    likes: 1430,
    date: '2026-07-29',
    author: 'Alexey V.'
  },
  {
    id: 'g-vertex-core',
    title: 'Vertex Core',
    categoryLabel: 'ЛОГОТИП',
    categoryKey: 'logos',
    image: '/src/assets/images/vertex_core_logo_1785589488739.jpg',
    isFeatured: false,
    description: 'Minimalist geometric V-shaped emblem with metallic bevels and subtle purple ambient backlight.',
    software: 'Illustrator + KeyShot',
    resolution: '1024 × 1280 (Mockup HQ)',
    views: 9810,
    likes: 890,
    date: '2026-07-25',
    author: 'Elena R.'
  },
  {
    id: 'g-solaris-interface',
    title: 'Solaris Interface',
    categoryLabel: 'ПРЕВЬЮ',
    categoryKey: 'previews',
    image: '/src/assets/images/solaris_interface_preview_1785589501038.jpg',
    isNew: true,
    description: 'Dark mode spatial computing telemetry dashboard with dynamic purple/cyan charts and node views.',
    software: 'React + WebGPU + Tailwind',
    resolution: '1024 × 1280 (Mockup HQ)',
    views: 15300,
    likes: 1720,
    date: '2026-07-30',
    author: 'Rival Dev Team'
  },
  {
    id: 'g-obsidian-ext',
    title: 'Project Obsidian',
    categoryLabel: '3D МОДЕЛЬ',
    categoryKey: 'banners',
    image: '/src/assets/images/project_obsidian_1785588861152.jpg',
    isFeatured: false,
    description: 'Brutalist glass architecture nestled in dark foggy pine forest with indigo volumetric mist.',
    software: 'Unreal Engine 5.4 Lumen',
    resolution: '1024 × 1280 (Mockup HQ)',
    views: 14820,
    likes: 1240,
    date: '2026-07-28',
    author: 'Markus K.'
  },
  {
    id: 'g-cyber-loft',
    title: 'Cyber Loft 2088',
    categoryLabel: 'ПРЕВЬЮ',
    categoryKey: 'previews',
    image: '/src/assets/images/cyber_loft_1785588876843.jpg',
    isFeatured: false,
    description: 'Ultra-luxury futuristic penthouse interior with panoramic window overlooking neon night metropolis.',
    software: '3ds Max + Corona + UE5',
    resolution: '1024 × 1280 (Mockup HQ)',
    views: 9430,
    likes: 856,
    date: '2026-07-15',
    author: 'Alexey V.'
  },
  {
    id: 'g-quartz-sanctuary',
    title: 'Quartz Sanctuary',
    categoryLabel: 'ИНТЕРФЕЙС',
    categoryKey: 'ui',
    image: '/src/assets/images/quartz_sanctuary_1785588887833.jpg',
    isFeatured: false,
    description: 'Subterranean basalt stone chamber with bioluminescent subterranean pool and caustics light physics.',
    software: 'Houdini + Redshift',
    resolution: '1024 × 1280 (Mockup HQ)',
    views: 12100,
    likes: 1092,
    date: '2026-06-30',
    author: 'Rival Studio Team'
  }
];

export const FEATURED_CASE: CaseStudy = {
  id: 'obsidian',
  title: 'Project Obsidian',
  subtitle: 'Sharp architectural lines meeting moody lighting',
  description: 'Sharp architectural lines meeting moody lighting in our latest digital environment.',
  tag: 'FEATURED CASE',
  image: '/src/assets/images/project_obsidian_1785588861152.jpg',
  category: 'exterior',
  date: '2026-07-28',
  views: 14820,
  likes: 1240,
  specs: {
    renderer: 'Unreal Engine 5.4 Lumen',
    lighting: 'Volumetric Indigo Twilight & Mist',
    polygonCount: '4.2M Tris (LOD Streamed)',
    resolution: '8K HDR Real-Time'
  },
  detailsText: 'Project Obsidian represents a peak architectural exploration combining brutalist minimalism with organic dark landscapes. Developed using custom shaders and physical glass refraction in UE5.'
};

export const CASES_LIST: CaseStudy[] = [
  FEATURED_CASE,
  {
    id: 'cyber-loft',
    title: 'Cyber Loft 2088',
    subtitle: 'High-density spatial penthouse visualizer',
    description: 'Ultra-luxury futuristic penthouse interior with panoramic views of neon night cityscape.',
    tag: 'INTERIOR ARCHITECTURE',
    image: '/src/assets/images/cyber_loft_1785588876843.jpg',
    category: 'interior',
    date: '2026-07-15',
    views: 9430,
    likes: 856,
    specs: {
      renderer: 'Path Tracing v2.1',
      lighting: 'Neon Ambient Occlusion',
      polygonCount: '6.8M Tris',
      resolution: '4K Ultra'
    },
    detailsText: 'Designed for spatial computing platforms with real-time room configuration and dynamic atmospheric lighting presets.'
  },
  {
    id: 'quartz-sanctuary',
    title: 'Quartz Sanctuary',
    subtitle: 'Subterranean basalt stone chamber',
    description: 'Minimalist subterranean architecture carved from dark basalt stone with subterranean glowing pool.',
    tag: 'SPATIAL EXPERIENCE',
    image: '/src/assets/images/quartz_sanctuary_1785588887833.jpg',
    category: 'spatial_ui',
    date: '2026-06-30',
    views: 12100,
    likes: 1092,
    specs: {
      renderer: 'Rival RayTrace Core',
      lighting: 'Bioluminescent Water Caustics',
      polygonCount: '3.1M Tris',
      resolution: '8K Master'
    },
    detailsText: 'A meditative digital sanctuary exploring acoustic bounce simulation and fluid caustics physics.'
  },
  {
    id: 'monolith-tower',
    title: 'Monolith Spatial Hub',
    subtitle: 'Corporate digital twin environment',
    description: 'Monolithic skyscraper conceptualized as a real-time data center and virtual headquarters.',
    tag: 'CONCEPTUAL CGI',
    image: '/src/assets/images/project_obsidian_1785588861152.jpg',
    category: 'exterior',
    date: '2026-06-12',
    views: 7800,
    likes: 640,
    specs: {
      renderer: 'Octane Standalone',
      lighting: 'Golden Hour Atmospheric Dusk',
      polygonCount: '12.4M Tris',
      resolution: '8K Panoramas'
    },
    detailsText: 'Multi-layer architectural model with full interior floorplans and interactive elevator simulation.'
  }
];

export const RECENT_UPDATES: UpdateItem[] = [
  {
    id: 'u1',
    title: 'v2.4 Deployed',
    time: '2H AGO',
    type: 'deploy',
    version: 'v2.4.0',
    details: 'Added WebGPU real-time viewport acceleration, enhanced volumetric fog rendering, and reduced mesh stream latency by 35%.'
  },
  {
    id: 'u2',
    title: 'Case Study Updated',
    time: '1D AGO',
    type: 'content',
    details: 'Project Obsidian updated with 8K raw EXR textures, raytraced reflection maps, and interactive light rig presets.'
  },
  {
    id: 'u3',
    title: 'System Maintenance',
    time: '3D AGO',
    type: 'maintenance',
    details: 'Scheduled cluster GPU node upgrade completed successfully. Node cluster capacity increased to 128 RTX 4090 units.'
  }
];

export const ACADEMY_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Mastering Moody Architectural Lighting',
    duration: '2.5 hrs',
    level: 'Masterclass',
    lessonsCount: 8,
    progress: 65,
    author: 'Alexey V., Lead Lighting Artist',
    category: 'Lighting & Shaders',
    thumbnail: '/src/assets/images/project_obsidian_1785588861152.jpg',
    description: 'Learn how to construct cinematic atmospheric lighting using volumetric fog, custom skyboxes, and indigo color grading.',
    lessons: [
      { id: 'l1', title: 'Understanding Volumetric Density', duration: '18 min', completed: true },
      { id: 'l2', title: 'Color Temperature & Mood Creation', duration: '22 min', completed: true },
      { id: 'l3', title: 'Glass Refraction & Caustics Shaders', duration: '25 min', completed: true },
      { id: 'l4', title: 'Lumen Post-Process Optimization', duration: '15 min', completed: false }
    ]
  },
  {
    id: 'c2',
    title: 'Photorealistic Obsidian & Glass Materials',
    duration: '1.8 hrs',
    level: 'Intermediate',
    lessonsCount: 6,
    progress: 30,
    author: 'Elena R., Technical Material Artist',
    category: 'Materials',
    thumbnail: '/src/assets/images/cyber_loft_1785588876843.jpg',
    description: 'Step-by-step masterclass on creating complex PBR node graphs for ultra-dark reflective obsidian surfaces.',
    lessons: [
      { id: 'l21', title: 'PBR Roughness & Anisotropy', duration: '20 min', completed: true },
      { id: 'l22', title: 'Micro-scratch Normal Maps', duration: '15 min', completed: false }
    ]
  },
  {
    id: 'c3',
    title: 'Real-time Spatial Audio Environments',
    duration: '3.1 hrs',
    level: 'Advanced',
    lessonsCount: 12,
    progress: 0,
    author: 'Markus K., Spatial Audio Dev',
    category: 'Audio Architecture',
    thumbnail: '/src/assets/images/quartz_sanctuary_1785588887833.jpg',
    description: 'Integrate binaural spatial reverberation and material sound absorption into 3D walkthroughs.',
    lessons: [
      { id: 'l31', title: 'Acoustic Raytracing Fundamentals', duration: '30 min', completed: false }
    ]
  }
];

export const CLIENT_REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Виктор Соколов',
    role: 'Главный архитектор',
    company: 'Sokolov Architecture Studio',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Команда Rival Space создала невероятную интерактивную презентацию нашего проекта в Unreal Engine 5. Заказчики были в полном восторге от качества освещения и деталей!',
    project: 'Project Obsidian Visualization',
    date: '25 июля 2026',
    verified: true
  },
  {
    id: 'r2',
    author: 'Анна Мельникова',
    role: 'Creative Director',
    company: 'AURA Spatial Labs',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Скорость рендеринга и уровень профессионализма — на высоте. Академия Rival Space также помогла нашей команде поднять уровень материалов.',
    project: 'Cyber Loft 2088 Render Package',
    date: '18 июля 2026',
    verified: true
  },
  {
    id: 'r3',
    author: 'Дмитрий Волков',
    role: 'Product Lead',
    company: 'NeuraTech Spaces',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Отличная коммуникация через интерфейс заказов. Заказ был выполнен раньше срока с безупречным качеством 8K текстур.',
    project: 'Quartz Sanctuary Spatial UI',
    date: '10 июля 2026',
    verified: true
  }
];

export const MOCK_RENDER_TASKS: RenderTask[] = [
  {
    id: 'rt-101',
    name: 'Project Obsidian — 8K Panorama Pass',
    status: 'rendering',
    progress: 78,
    node: 'RIVAL-GPU-NODE-04',
    renderEngine: 'UE5 Lumen Hardware RT',
    estTimeLeft: '14 min'
  },
  {
    id: 'rt-102',
    name: 'Cyber Loft — Volumetric Lighting Bake',
    status: 'queued',
    progress: 0,
    node: 'RIVAL-GPU-NODE-09',
    renderEngine: 'Path Tracer v2.4',
    estTimeLeft: 'Waiting'
  },
  {
    id: 'rt-103',
    name: 'Quartz Chamber — EXR Texture Export',
    status: 'completed',
    progress: 100,
    node: 'RIVAL-GPU-NODE-01',
    renderEngine: 'Rival Core Renderer',
    estTimeLeft: 'Finished'
  }
];
