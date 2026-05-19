import { z } from 'zod';

export const NavItemSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const BlogPostSchema = z.object({
  title: z.string(),
  category: z.string(),
  date: z.string(),
  image: z.string(),
  href: z.string(),
});

export const HeroSchema = z.object({
  subtitle: z.string(),
  title: z.string(),
  backgroundImage: z.string(),
  showStars: z.boolean().optional(),
});

export const AboutSchema = z.object({
  subtitle: z.string(),
  title: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  ctaText: z.string(),
  ctaLink: z.string(),
});

export const PropertySchema = z.object({
  location: z.string(),
  title: z.string(),
  description: z.string(),
  imageUrls: z.array(z.string()),
  ctaText: z.string(),
  ctaLink: z.string(),
  reversed: z.boolean().optional(),
});

export const WildernessSchema = z.object({
  title: z.string(),
  description: z.string(),
  imageUrl: z.string(),
});

export const ExperiencesSchema = z.object({
  subtitle: z.string(),
  title: z.string(),
  description: z.string(),
  imageUrls: z.array(z.string()),
  features: z.array(z.string()),
});

export const SustainabilitySchema = z.object({
  subtitle: z.string(),
  title: z.string(),
  description: z.string(),
  motto: z.string(),
  quote: z.string(),
  bgImage: z.string(),
});

export const TripPlanningSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  features: z.array(z.string()),
  ctaText: z.string(),
  ctaLink: z.string(),
  imageUrl: z.string(),
});

export const FooterSchema = z.object({
  logoUrl: z.string(),
  newsletterText: z.string(),
  newsletterSubtext: z.string(),
  phone: z.array(z.string()),
  address: z.string(),
  email: z.string(),
  socialLinks: z.array(z.object({ name: z.string(), href: z.string(), icon: z.string() })),
  navItems: z.array(NavItemSchema),
  legalLinks: z.array(NavItemSchema),
});

export const BlogCarouselSchema = z.object({
  subtitle: z.string(),
  title: z.string(),
  posts: z.array(BlogPostSchema),
});

export const NavigationSchema = z.object({
  logoUrl: z.string(),
  navItems: z.array(NavItemSchema),
});
