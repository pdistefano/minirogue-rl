import { Engine } from "geotic";
import {
  ActiveEffects,
  Ai,
  Animate,
  Appearance,
  Description,
  Defense,
  Effects,
  Health,
  Inventory,
  IsBlocking,
  IsLiveBeing,
  IsDead,
  IsInFov,
  IsOpaque,
  IsPickup,
  IsRevealed,
  Layer100,
  Layer300,
  Layer400,
  Move,
  Paralyzed,
  Poisoned,
  Position,
  Power,
  RequiresTarget,
  Target,
  TargetingItem,
} from "./components";

import {
  Being,
  Item,
  Tile,
  HealthPotion,
  PoisonPotion,
  FrostPotion,
  ScrollFireball,
  ScrollLightning,
  Goblin,
  Player,
  Dummy,
  Wall,
  Floor,
  StairsUp,
  StairsDown,
} from "./prefabs";

const ecs = new Engine();

// all Components must be `registered` by the engine
ecs.registerComponent(ActiveEffects);
ecs.registerComponent(Animate);
ecs.registerComponent(Ai);
ecs.registerComponent(Appearance);
ecs.registerComponent(Description);
ecs.registerComponent(Defense);
ecs.registerComponent(Effects);
ecs.registerComponent(Health);
ecs.registerComponent(Inventory);
ecs.registerComponent(IsBlocking);
ecs.registerComponent(IsLiveBeing);
ecs.registerComponent(IsDead);
ecs.registerComponent(IsInFov);
ecs.registerComponent(IsOpaque);
ecs.registerComponent(IsPickup);
ecs.registerComponent(IsRevealed);
ecs.registerComponent(Layer100);
ecs.registerComponent(Layer300);
ecs.registerComponent(Layer400);
ecs.registerComponent(Move);
ecs.registerComponent(Paralyzed);
ecs.registerComponent(Poisoned);
ecs.registerComponent(Position);
ecs.registerComponent(Power);
ecs.registerComponent(RequiresTarget);
ecs.registerComponent(Target);
ecs.registerComponent(TargetingItem);

// register "base" prefabs first!
ecs.registerPrefab(Tile);
ecs.registerPrefab(Being);
ecs.registerPrefab(Item);

ecs.registerPrefab(HealthPotion);
ecs.registerPrefab(PoisonPotion);
ecs.registerPrefab(FrostPotion);
ecs.registerPrefab(Wall);
ecs.registerPrefab(Floor);
ecs.registerPrefab(Goblin);
ecs.registerPrefab(Player);
ecs.registerPrefab(Dummy);
ecs.registerPrefab(ScrollFireball);
ecs.registerPrefab(ScrollLightning);
ecs.registerPrefab(StairsUp);
ecs.registerPrefab(StairsDown);

export default ecs;
