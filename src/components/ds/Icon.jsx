import React from 'react';
import {
  ArrowDown,
  ArrowDownUp,
  ArrowRight,
  AtSign,
  BookOpen,
  Bookmark,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Feather,
  Github,
  Hammer,
  Heart,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Moon,
  Rss,
  Search,
  Sun,
  Twitter,
  X,
} from 'lucide-react';

/**
 * Icon — drop-in replacement for the kits' Lucide-UMD helper.
 * The design kits referenced icons by kebab-case name (data-driven);
 * this maps those names to `lucide-react` components so the same
 * `<Icon name="arrow-down" .../>` call sites keep working.
 */
const ICONS = {
  'arrow-down': ArrowDown,
  'arrow-down-up': ArrowDownUp,
  'arrow-right': ArrowRight,
  'at-sign': AtSign,
  'book-open': BookOpen,
  bookmark: Bookmark,
  briefcase: Briefcase,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  download: Download,
  'external-link': ExternalLink,
  feather: Feather,
  github: Github,
  hammer: Hammer,
  heart: Heart,
  linkedin: Linkedin,
  mail: Mail,
  'map-pin': MapPin,
  menu: Menu,
  moon: Moon,
  rss: Rss,
  search: Search,
  sun: Sun,
  twitter: Twitter,
  x: X,
};

export function Icon({ name, size = 18, color = 'currentColor', strokeWidth = 1.75, style, className = '' }) {
  const Cmp = ICONS[name];
  return (
    <span className={`inline-flex leading-[0] ${className}`} style={style}>
      {Cmp ? <Cmp size={size} color={color} strokeWidth={strokeWidth} /> : null}
    </span>
  );
}
