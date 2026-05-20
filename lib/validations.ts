import { z } from "zod";

export const TRAVEL_GROUPS = ["SOLO","FAMILY","PARTNER","FRIENDS","GROUP_TOUR"] as const;
export const TRANSPORT_MODES = ["Bus","Train","Car","Bike/Motorcycle","Flight","Taxi/Cab","Auto","Other"] as const;
export const STAY_TYPES = ["Hotel","Homestay","Hostel","Camping","Airbnb","Other"] as const;

export const postSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(5000),
  destination: z.string().trim().min(2).max(160),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  travelGroup: z.enum(TRAVEL_GROUPS),
  transportModes: z.array(z.object({
    mode: z.enum(TRANSPORT_MODES),
    details: z.string().max(400).optional().or(z.literal(""))
  })).default([]),
  stays: z.array(z.object({
    name: z.string().trim().min(1).max(120),
    location: z.string().trim().min(1).max(160),
    type: z.enum(STAY_TYPES),
    costPerNight: z.number().nonnegative().optional().nullable(),
    rating: z.number().min(0).max(5).optional().nullable()
  })).default([]),
  cafes: z.array(z.object({
    name: z.string().trim().min(1).max(120),
    location: z.string().trim().min(1).max(160),
    hadWhat: z.string().max(400).optional().or(z.literal("")),
    rating: z.number().min(0).max(5).optional().nullable()
  })).default([]),
  photos: z.array(z.object({
    url: z.string().url(),
    caption: z.string().max(200).optional().or(z.literal(""))
  })).max(10).default([])
}).refine(d => new Date(d.endDate) >= new Date(d.startDate), {
  message: "End date must be on or after start date", path: ["endDate"]
});

export type PostInput = z.infer<typeof postSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(200)
});
