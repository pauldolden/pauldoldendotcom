export interface Project {
  name: string;
  iconPath: string;
  data: {
    desc: string;
    href: string;
    status: string;
    role: string;
    stack: string[];
  };
}
