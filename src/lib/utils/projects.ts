import type { Project } from '$lib/types/Project';

export const projects: Project[] = [
  {
    name: 'TalkCare',
    iconPath: '/svg/react.svg',
    data: {
      status: 'Complete',
      desc: 'Social networking mobile application aimed at health professionals, to discuss their life in healthcare.',
      role: 'I designed and developed the front end of this healthcare centric social network mobile application, and its web based admin panel. ',
      href: 'https://talkcare.co.uk',
      stack: [
        'React Native/React',
        'TypeScript',
        'Expo',
        'Redux',
        'XCode',
        'Android Studio',
        'TailwindCSS'
      ]
    }
  },
  {
    name: 'Dementia Dictionary',
    iconPath: '/svg/react.svg',
    data: {
      status: 'Complete',
      desc: 'A mobile application forum for professionals and family to dicuss their experiences of caring for people with dementia.',
      role: 'I designed and developed the front end of this mobile application, with a focus on adapting and enhancing the functionality and design of the existing web site, into a mobile application. ',
      href: 'https://dementiadictionary.com',
      stack: ['React Native', 'TypeScript', 'Expo', 'Redux', 'XCode', 'Android Studio']
    }
  },
  {
    name: 'New Woods Farm',
    iconPath: '/svg/next-dot-js.svg',
    data: {
      status: 'Complete (Pending Data)',
      desc: 'A brochure site for an award-winning Ryeland Sheep breeder, small holding and hand-made crafts store.',
      role: 'I designed and developed the site, with help from TailwindUI.',
      href: 'https://nwf.netlify.app',
      stack: ['React', 'TypeScript', 'NextJS', 'Contentul', 'TailwindCSS', 'Netlify']
    }
  },
  {
    name: 'Rudy & Aurora',
    iconPath: '/svg/gatsby.svg',
    data: {
      status: 'Complete',
      desc: 'A baby loss awareness blog, built for my wife to openly discuss her experiences with baby loss and as a contact point for people coping with the same struggles.',
      role: 'I designed and developed the site, built with love for my wife and my baby girls.',
      href: 'https://rudyandaurora.com',
      stack: ['React', 'TypeScript', 'Gatsby', 'Prismic', 'Styled Components', 'Netlify']
    }
  },
  {
    name: 'chaptr.cloud',
    iconPath: '/svg/svelte.svg',
    data: {
      status: 'In Development',
      desc: 'A tool for writing and managing large writing projects.',
      role: 'I am working as project lead, and building as a collaborative effort with a UI/UX designer.',
      href: '#',
      stack: ['Svelte', 'SvetleKit', 'TailwindCSS', 'Vercel']
    }
  },
  {
    name: 'Broomfield Baby Bereavement',
    iconPath: '/svg/svelte.svg',
    data: {
      status: 'In Development',
      desc: 'A pro-bono project, built for a baby loss support group.',
      role: 'I am working as project lead, and building as a collaborative effort with a UI/UX designer.',
      href: 'https://three-bs.vercel.app/',
      stack: ['Svelte', 'SvetleKit', 'TailwindCSS', 'Vercel']
    }
  }
];
