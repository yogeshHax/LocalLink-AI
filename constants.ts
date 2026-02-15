import { User, SkillCategory } from './types';

// --- Mock Data ---

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Sarah Chen',
    avatar: 'https://picsum.photos/id/64/200/200',
    location: 'Downtown, 0.5km away',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    trustScore: 98,
    isVerified: true,
    credits: 12,
    skillsNeeded: ['Plumbing', 'Guitar Lessons'],
    skillsOffered: [
      {
        id: 's1',
        name: 'Advanced React Tutoring',
        category: SkillCategory.TECH,
        description: 'Senior engineer offering 1-on-1 React & TypeScript mentorship.',
        hourlyRate: 80,
        creditValue: 2,
        images: ['https://picsum.photos/id/1/400/300']
      }
    ]
  },
  {
    id: 'u2',
    name: 'Marcus Johnson',
    avatar: 'https://picsum.photos/id/91/200/200',
    location: 'Westside, 2.1km away',
    coordinates: { lat: 40.7200, lng: -74.0100 },
    trustScore: 92,
    isVerified: true,
    credits: 5,
    skillsNeeded: ['Web Development', 'Gardening'],
    skillsOffered: [
      {
        id: 's2',
        name: 'Emergency Plumbing',
        category: SkillCategory.MANUAL_LABOR,
        description: 'Licensed plumber available for quick fixes and installs.',
        hourlyRate: 120,
        creditValue: 3,
        images: ['https://picsum.photos/id/175/400/300']
      },
      {
        id: 's3',
        name: 'Classical Guitar Basics',
        category: SkillCategory.CREATIVE,
        description: 'Learn to play classical guitar. Beginners welcome.',
        hourlyRate: 40,
        creditValue: 1,
        images: ['https://picsum.photos/id/145/400/300']
      }
    ]
  },
  {
    id: 'u3',
    name: 'Elena Rodriguez',
    avatar: 'https://picsum.photos/id/65/200/200',
    location: 'North Hills, 4km away',
    coordinates: { lat: 40.7300, lng: -73.9900 },
    trustScore: 88,
    isVerified: false,
    credits: 20,
    skillsNeeded: ['Math Tutoring'],
    skillsOffered: [
      {
        id: 's4',
        name: 'Portrait Photography',
        category: SkillCategory.CREATIVE,
        description: 'Professional headshots and lifestyle photography.',
        hourlyRate: 150,
        creditValue: 4,
        images: ['https://picsum.photos/id/250/400/300']
      }
    ]
  }
];

export const CURRENT_USER: User = {
  id: 'me',
  name: 'Alex Design',
  avatar: 'https://picsum.photos/id/338/200/200',
  location: 'Home',
  coordinates: { lat: 40.7128, lng: -74.0060 },
  trustScore: 95,
  isVerified: true,
  credits: 8,
  skillsNeeded: ['Photography', 'Plumbing'],
  skillsOffered: [
    {
      id: 'my1',
      name: 'UX/UI Design Review',
      category: SkillCategory.TECH,
      description: 'I will critique your app design and provide Figma improvements.',
      hourlyRate: 90,
      creditValue: 2,
    }
  ]
};

// Placeholder for removed docs
export const DATABASE_SCHEMA_DOC = "";
export const API_STRUCTURE_DOC = "";