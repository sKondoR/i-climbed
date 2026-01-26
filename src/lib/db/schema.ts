import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// regions table
export const regions = pgTable('regions', {
  id: serial('id').primaryKey(),
  uniqId: varchar('uniq_id', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  country: varchar('country', { length: 255 }).notNull(),
  season: varchar('season', { length: 255 }),
  link: text('link').notNull(),
});

export type IRegion = typeof regions.$inferSelect;

// places table
export const places = pgTable('places', {
  id: serial('id').primaryKey(),
  uniqId: varchar('uniq_id', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  numroutes: integer('numroutes').notNull(),
  link: text('link').notNull(),
  regionId: integer('region_id').notNull(),
});

export const placesRelations = relations(places, ({ one }) => ({
  regions: one(regions, {
    fields: [places.regionId],
    references: [regions.uniqId],
  }),
}));

export type IPlace = typeof places.$inferSelect;

// sectors table
export const sectors = pgTable('sectors', {
  id: serial('id').primaryKey(),
  uniqId: varchar('uniq_id', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  numroutes: integer('numroutes'),
  link: text('link'),
  placeId: integer('place_id').notNull(),
});

export const sectorsRelations = relations(sectors, ({ one }) => ({
  places: one(places, {
    fields: [sectors.placeId],
    references: [places.uniqId],
  }),
}));

export type ISector = typeof sectors.$inferSelect;

// routes table
export const routes = pgTable('routes', {
  id: serial('id').primaryKey(),
  uniqId: varchar('uniq_id', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  author: varchar('author', { length: 255 }),
  bolts: varchar('bolts', { length: 255 }),
  type: varchar('type', { length: 255 }),
  grade: varchar('grade', { length: 255 }),
  length: varchar('length', { length: 255 }),
  top: varchar('top', { length: 255 }),
  link: text('link'),
  sectorLink: text('sector_link'),
  sectorId: integer('sector_id').notNull(),
});

export const routesRelations = relations(routes, ({ one }) => ({
  sectors: one(sectors, {
    fields: [routes.sectorId],
    references: [sectors.uniqId], 
  }),
}));

export type IRoute = typeof routes.$inferSelect;

// images table
export const images = pgTable('images', {
  id: serial('id').primaryKey(),
  uniqId: varchar('uniq_id', { length: 255 }),
  imageData: text('data_base64').notNull(),
  error: text('error'),
  routeId: integer('route_id').notNull(),
});

export const imageRelations = relations(images, ({ one }) => ({
  routes: one(routes, {
    fields: [images.routeId],
    references: [routes.uniqId],
  }),
}));

export type IImage = typeof images.$inferSelect;

export interface IScrapStats {
  regions: number;
  regionsErrors: number;
  places: number;
  placesErrors: number;
  sectors: number;
  sectorsErrors: number;
  routes: number;
  routesErrors?: number;
  scrapDate: string;
  scrapDuration?: string;
}

// settings table
export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  scrapStats: jsonb('scrapStats').$type<IScrapStats>(),
});

export type ISettings = typeof settings.$inferSelect;

export const schema = {
  regions,
  places,
  sectors,
  routes,
  images,
  settings,
  placesRelations,
  sectorsRelations,
  routesRelations,
  imageRelations,
};

