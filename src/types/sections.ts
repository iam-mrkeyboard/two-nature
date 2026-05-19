import type { z } from 'zod';
import type {
  HeroSchema,
  AboutSchema,
  PropertySchema,
  WildernessSchema,
  ExperiencesSchema,
  SustainabilitySchema,
  TripPlanningSchema,
  FooterSchema,
  BlogCarouselSchema,
  NavigationSchema,
} from '../lib/schemas';

export type HeroData = z.infer<typeof HeroSchema>;
export type AboutData = z.infer<typeof AboutSchema>;
export type PropertyData = z.infer<typeof PropertySchema>;
export type WildernessData = z.infer<typeof WildernessSchema>;
export type ExperiencesData = z.infer<typeof ExperiencesSchema>;
export type SustainabilityData = z.infer<typeof SustainabilitySchema>;
export type TripPlanningData = z.infer<typeof TripPlanningSchema>;
export type FooterData = z.infer<typeof FooterSchema>;
export type BlogCarouselData = z.infer<typeof BlogCarouselSchema>;
export type NavigationData = z.infer<typeof NavigationSchema>;
