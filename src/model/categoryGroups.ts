import { CategoryCatalogEntry } from "@/model/category";

export type CategoryGroupId =
  | "sport"
  | "anime"
  | "cinemaGaming"
  | "history"
  | "geography"
  | "sciences"
  | "arts"
  | "general";

export const CATEGORY_GROUP_ORDER: CategoryGroupId[] = [
  "sport",
  "anime",
  "cinemaGaming",
  "history",
  "geography",
  "sciences",
  "arts",
  "general",
];

// Any category key not listed below falls back to "general" — that bucket is
// the catch-all for categories that aren't tied to one of the clear themes.
const GROUP_MEMBERS: Record<Exclude<CategoryGroupId, "general">, string[]> = {
  sport: [
    "sport",
    "football",
    "world_cup",
    "premier_league",
    "bundesliga",
    "champions_league",
    "la_liga",
  ],
  anime: [
    "anime",
    "naruto",
    "naruto_characters",
    "one_piece",
    "one_piece_characters",
    "dragon_ball",
    "dragon_ball_characters",
    "bleach",
    "bleach_characters",
    "attack_on_titan",
    "attack_on_titan_characters",
    "my_hero_academia",
    "my_hero_academia_characters",
    "demon_slayer",
    "demon_slayer_characters",
    "jujutsu_kaisen",
    "jujutsu_kaisen_characters",
    "hunter_x_hunter",
    "hunter_x_hunter_characters",
    "tokyo_ghoul",
    "tokyo_ghoul_characters",
    "one_punch_man",
    "one_punch_man_characters",
    "death_note",
    "death_note_characters",
    "fullmetal_alchemist",
    "fullmetal_alchemist_characters",
  ],
  cinemaGaming: ["cinema", "video_games"],
  history: ["history", "ww1", "ww2", "islamic_civilization", "exploration"],
  geography: ["geography", "capitals", "flags", "oceans", "voyages"],
  sciences: [
    "sciences",
    "chemistry",
    "human_body",
    "space",
    "medecine",
    "mathematics",
    "dinosaurs",
    "inventions",
    "technologie",
    "technology",
  ],
  arts: [
    "art",
    "musique",
    "music_ar",
    "world_music",
    "world_literature",
    "littérature arabe",
    "mythologie",
    "mythology",
    "religion",
    "philosophie",
  ],
};

const KEY_TO_GROUP = new Map<string, CategoryGroupId>();
for (const groupId of Object.keys(GROUP_MEMBERS) as (keyof typeof GROUP_MEMBERS)[]) {
  for (const key of GROUP_MEMBERS[groupId]) {
    KEY_TO_GROUP.set(key, groupId);
  }
}

export function getCategoryGroup(key: string): CategoryGroupId {
  return KEY_TO_GROUP.get(key) ?? "general";
}

export function groupCategories(
  categories: CategoryCatalogEntry[]
): { id: CategoryGroupId; categories: CategoryCatalogEntry[] }[] {
  const byGroup = new Map<CategoryGroupId, CategoryCatalogEntry[]>();

  for (const cat of categories) {
    const groupId = getCategoryGroup(cat.key);
    const bucket = byGroup.get(groupId);
    if (bucket) {
      bucket.push(cat);
    } else {
      byGroup.set(groupId, [cat]);
    }
  }

  return CATEGORY_GROUP_ORDER.filter((id) => byGroup.has(id)).map((id) => ({
    id,
    categories: byGroup.get(id)!,
  }));
}
