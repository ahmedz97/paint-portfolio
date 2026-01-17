export interface NavigationItem {
  text: string;
  href: string;
}

export interface Language {
  value: string;
  label: string;
}

export interface Site {
  name: string;
  title: string;
  logo: string;
  footerLogo: string;
  copyright: string;
  copyrightLink: string;
  languages: Language[];
  navigation: NavigationItem[];
}

export interface Slide {
  image: string;
  welcomeText: string;
  title: string;
  buttonText: string;
  buttonLink: string;
}

export interface Service {
  number: string;
  icon: string;
  title: string;
  link: string;
}

export interface ServiceSolution {
  title: string;
  titleDot: string;
  description: string;
  services: Service[];
}

export interface Downtown {
  images: Array<{ src: string; class: string }>;
  title: string;
  titleDot: string;
  subtitle: string;
  description: string;
  features: string[];
  since: { text: string };
  buttonText: string;
  buttonLink: string;
}

export interface Video {
  title: string;
  titleDot: string;
  videoUrl: string;
  heading: string;
  buttonText: string;
  buttonLink: string;
}

export interface PortfolioFilter {
  text: string;
  filter: string;
}

export interface PortfolioItem {
  image: string;
  category: string;
  title: string;
  link: string;
  classes: string;
}

export interface Portfolio {
  title: string;
  titleDot: string;
  filters: PortfolioFilter[];
  items: PortfolioItem[];
  pagination: { pages: number[] };
}

export interface Stat {
  value: number;
  label: string;
  speed: number;
}

export interface Counter {
  stats: Stat[];
  commitment: {
    title: string;
    features: Array<{ number: string; title: string; subtitle: string }>;
    trusted: {
      title: string;
      titleDot: string;
      description: string;
      image: string;
      features: string[];
    };
  };
}

export interface SocialLink {
  icon: string;
  link: string;
}

export interface TeamMember {
  image: string;
  name: string;
  position: string;
  socialLinks: SocialLink[];
}

export interface Team {
  title: string;
  titleDot: string;
  members: TeamMember[];
  bigBoss: TeamMember;
}

export interface AboutCounter {
  icon: string;
  text: string;
  highlightedText: string;
}

export interface SolutionTab {
  id: string;
  label: string;
  content: string;
}

export interface SolutionBox {
  title: string;
  titleDot: string;
  tabs: SolutionTab[];
  description: string;
  image: string;
  features: string[];
}

export interface BlogPost {
  image: string;
  date: string;
  author: string;
  comments: string;
  title: string;
  description: string;
  link: string;
}

export interface BlogBox {
  title: string;
  titleDot: string;
  buttonText: string;
  buttonLink: string;
  posts: BlogPost[];
}

export interface Home {
  skitter_slider: { slides: Slide[] };
  serviceSolution: ServiceSolution;
  downtown: Downtown;
  video: Video;
  portfolio: Portfolio;
  counter: Counter;
  team: Team;
  aboutCounter: AboutCounter;
  solutionBox: SolutionBox;
  blogBox: BlogBox;
}

export interface FooterContact {
  icon: string;
  text: string;
  link: string;
}

export interface Footer {
  logo: string;
  description: string;
  socialLinks: SocialLink[];
  explore: {
    title: string;
    links: Array<{ text: string; link: string }>;
  };
  contact: {
    title: string;
    address: FooterContact;
    phone: FooterContact;
    email: FooterContact;
  };
  newsletter: {
    title: string;
    placeholder: string;
    description: string;
  };
  copyright: string;
  copyrightLink: string;
}

export interface Banner {
  title: string;
  breadcrumb: {
    home: string;
    current: string;
  };
}

export interface BusinessDescItem {
  image: string;
  text: string;
  link: string;
}

export interface Testimonial {
  image: string;
  name: string;
  position: string;
  text: string;
}

export interface About {
  banner: Banner;
  businessDesc: { items: BusinessDescItem[] };
  feedback: {
    title: string;
    titleDot: string;
    testimonials: Testimonial[];
  };
}

export interface Office {
  name: string;
  address: string;
  email: string;
  phone: string;
}

export interface ContactFormField {
  type: string;
  placeholder: string;
  required: boolean;
}

export interface Contact {
  banner: Banner;
  offices: {
    title: string;
    titleDot: string;
    items: Office[];
  };
  map: {
    iframe: string;
  };
  form: {
    title: string;
    titleDot: string;
    fields: ContactFormField[];
    submitText: string;
  };
}

export interface Gallery {
  banner: Banner;
  description: string;
  images: { src: string }[];
  pagination: {
    pages: number[];
  };
}

// service page
export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  link: string;
}

export interface WorkTab {
  id: string;
  label: string;
  image: string;
  description: string;
  highlightedText: string;
  features: string[];
}

export interface Service {
  banner: Banner;
  services: {
    items: ServiceItem[];
  };
  work: {
    title: string;
    titleDot: string;
    tabs: WorkTab[];
  };
}

// vr page
export interface Vr {
  banner: Banner;
  description: string;
  images: { src: string; class: string }[];
  pagination: {
    pages: number[];
  };
}

export interface ProjectData {
  SITE: Site;
  HOME: Home;
  FOOTER: Footer;
  ABOUT: About;
  CONTACT: Contact;
  GALLERY: Gallery;
  VR: Vr;
  SERVICES: Service;
}
