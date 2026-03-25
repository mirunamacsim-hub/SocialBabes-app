import { Event, Collaborator } from './types';

export const COLLABORATORS: Collaborator[] = [
  {
    id: '1',
    name: 'Elena Vance',
    role: 'Lead Designer',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa8RnooYN43H7zgUJ0VxZDLoONADZJCabq6y-YU-OkKFS8z_-WUo5aYEbGWzmiVW3Q33SDbf1xiHvEgDGN0Tv92vA2FmSKWP5VRNNSbOVco_ZQ47tS9F8cngt_V44OoVCuw5a-OWAhYabJykQj7KfuMhewZCYyjHPtwAAYMuTAK5eVpY8H5waqgTmdIm2Oe7E0A9QQ_7l2msZ6xMApHjQ-X3tM_9zfPXbQzVyQ3BFQOLNLGQT3GCH-8q9VC64yPJVzPKwqfzlLB90'
  },
  {
    id: '2',
    name: 'Marcus Thorne',
    role: 'Strategist',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKUOQl2vkRqXOU1ZeTKEgqDCQ8uwvN2Q3fdween-0Evq-wHC_vwO-Y2eRVBwDmex6GCFhcbwsAkRxTAh1LxMNxKkzl_M-QLS8yhLmLnb-Zu11aympTVNtC10VNR09coJ3sVyWtCLdV9gNQ0Z8B1UAz2ZIZwpyWhEhOjtGWiBmvCDmKXVYgsX2ekV5vgDLlBZoHRVAKwao-FHNSiVWmD0zl0E3NRa1xxPY9OvIsdF0HdaieRtVJEPydiKrZzvym5f854f3fG_aox0k'
  },
  {
    id: '3',
    name: 'Sasha Gray',
    role: 'Editor',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWhaMrH_ESzC0od_TX_bLeLC87C2CyBY9zJ05Wj6E6a_xatfKaHqVg2zo_9wwUx3_k5zzKioJ7F1TVh2KE7lq6sAfrs4SoqCWbmTgm88e0gbBKz3hJMNZ4aTkMkjkQEP0o0zV7L82-KVQGunCN7JLtickqTFSCgnm7Ewk5PyJCO7t_hZkxgXM1xb5hDaN-nAAjtMaD7xa_Eh9WQh--KLh3342-Rkb26yrzsLdVDSwYNZQEGeRlwRvECYTv4qK_3ySUBbX_VD8v12Q'
  },
  {
    id: '4',
    name: 'Sarah Jenkins',
    role: 'Marketing',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgUBSgVO-_btz0SyULOB7LMOIu93gxYYF5dyZn8tDyh1-iHsGRUyGv4By7MLPleMTbC6fRh6ikA1U25OVLtKhMI87mZXavZx3jYYlDmnSO_935uyh0BXvbomo0L1daFyAa8Mx7Y6SyX_NpP6LerdB93QBb4KEXmoFQ9jlXtZu8Q_rbDSLi4CL3x4M4s2NbCw84jdafsE9rzFmugwuV0IeeaLxam5DTkSwqZtfSaKwDcsy4ip3brjv42kxegxkD5abJ5djClYkNM-k'
  }
];

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
    collaborators: [COLLABORATORS[0], COLLABORATORS[1], COLLABORATORS[2]],
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
    collaborators: [COLLABORATORS[3]]
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
    collaborators: [COLLABORATORS[1]],
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
    collaborators: [COLLABORATORS[0]]
  }
];
