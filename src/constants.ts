import { Event, Collaborator } from './types';

export const COLLABORATORS: Collaborator[] = [];

export const INITIAL_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Quarterly Botanical Strategy Session',
    description: 'A focused deep-dive into the upcoming editorial calendar, exploring new organic textures and sustainable design philosophies for the autumn collection.',
    date: 'March 24, 2026',
    time: '10:00 AM — 2:30 PM',
    duration: '270 Mins',
    type: 'Internal',
    department: 'Design & Editorial',
    location: 'The Atelier Loft',
    address: '422 Studio Circle, Suite 10, Portland, OR',
    tags: ['#Editorial', '#Vision2026', '#Design', '#Strategy'],
    collaborators: [],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3JRp4OMJcT8AsS1m_mJmXAaRYjdwaLHrN3nhaX9Kd-GOwX9_YGBWHt8_2tAYExzSREzgCUz8FRX0tl4DZ9-ahppe5Agnr_tEtp_9rirZ1AmyZ7_Q2ckkvAW4x79w4vj1dHN7X3k6RfHtfavohjpKCqtM1cFrR-BAnTOadeePo2FupUcLZ40zA8Tm1Bcn5D-JKgILnMcM1GQFtQJQYidHulehU-e4Dc8lu9N7T2rFhvg33-NGh6z3KZgpFH3ABspsuaCO98ifw2-Y',
    category: 'Workshop'
  },
  {
    id: '2',
    title: 'Strategic Editorial Planning',
    description: 'Q4 Content strategy for botanical collections and digital asset management workflow.',
    date: 'March 25, 2026',
    time: '09:00 AM',
    duration: '60 Mins',
    type: 'Internal',
    department: 'Marketing',
    location: 'Meeting Room Alpha',
    address: 'HQ, Floor 3',
    tags: ['#Marketing', '#Planning'],
    collaborators: []
  },
  {
    id: '3',
    title: 'Botanical Garden Photo Shoot',
    description: 'On-site photography session for the new seasonal lookbook.',
    date: 'March 25, 2026',
    time: '02:30 PM',
    duration: '45 Mins',
    type: 'External',
    department: 'Creative',
    location: 'Portland Botanical Garden',
    address: '611 SW Kingston Ave, Portland, OR',
    tags: ['#Photography', '#Seasonal'],
    collaborators: [],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVhVWI9mXEQ5z-IuHblLn_kDnfMDcFSOX-f8S5YluKl5xovTxDU5c4zJD82dZUULzdfq7tZPB2fExM1f-k6X96bKtyasyoJFr_oOBf0fG-3Qxvov2PhPlagPngUdh4_9iRr56Oj3pvysC_ODDmHePAP7Lef0n6yZU41xCMwwI2u-0t287rtO1O1mOOkVyuN-_u0rv4nG4HD0_o24ujN9gxm2fKdtOOwXD7F8P2ccDwPX68mD2FAXG2XNEeBxdCWXGAD5f10hQ6LqE'
  },
  {
    id: '4',
    title: 'Client Onboarding: Flora & Co.',
    description: 'Initial kickoff meeting with our new botanical supply partner.',
    date: 'March 26, 2026',
    time: '11:00 AM',
    duration: '90 Mins',
    type: 'External',
    department: 'Account Management',
    location: 'Virtual',
    address: 'Zoom Link',
    tags: ['#Priority', '#Client'],
    collaborators: []
  }
];

export const PPG_IMAGES = [
  "https://i.pinimg.com/736x/71/45/c2/7145c287d03b4e88f976668d0c6ec401.jpg",
  "https://i.pinimg.com/1200x/30/5a/8c/305a8cb2fccf2dad3ad537d5fe628697.jpg",
  "https://i.pinimg.com/736x/8e/05/2c/8e052cdedf81a21d237ea41c159f0736.jpg",
  "https://i.pinimg.com/736x/ac/37/3b/ac373b92cfa03bf2b00c73205bf022e2.jpg",
  "https://i.pinimg.com/736x/66/ab/8e/66ab8e4aff50d60e67a39e2e4657d4df.jpg",
  "https://i.pinimg.com/736x/77/d7/da/77d7da83e56b6b305185034f7b6e28ac.jpg"
];
