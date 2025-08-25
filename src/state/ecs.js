import { Engine } from "geotic";
import * as Components from "./components";
import * as Prefabs from "./prefabs";

const ecs = new Engine();

// all Components must be `registered` by the engine
ecs.registerComponent(Components.ActiveEffects);
ecs.registerComponent(Components.Ai);
ecs.registerComponent(Components.Animate);
ecs.registerComponent(Components.Appearance);
ecs.registerComponent(Components.Defense);
ecs.registerComponent(Components.Description);
ecs.registerComponent(Components.Effects);
ecs.registerComponent(Components.Experience);
ecs.registerComponent(Components.Health);
ecs.registerComponent(Components.Inventory);
ecs.registerComponent(Components.IsBlocking);
ecs.registerComponent(Components.IsDead);
ecs.registerComponent(Components.IsInFov);
ecs.registerComponent(Components.IsLiveBeing);
ecs.registerComponent(Components.IsOpaque);
ecs.registerComponent(Components.IsPickup);
ecs.registerComponent(Components.IsRevealed);
ecs.registerComponent(Components.Layer100);
ecs.registerComponent(Components.Layer300);
ecs.registerComponent(Components.Layer400);
ecs.registerComponent(Components.Move);
ecs.registerComponent(Components.Paralyzed);
ecs.registerComponent(Components.Poisoned);
ecs.registerComponent(Components.Position);
ecs.registerComponent(Components.Power);
ecs.registerComponent(Components.RequiresTarget);
ecs.registerComponent(Components.Target);
ecs.registerComponent(Components.TargetingItem);

// register "base" prefabs first!
ecs.registerPrefab(Prefabs.Tile);
ecs.registerPrefab(Prefabs.Being);
ecs.registerPrefab(Prefabs.Item);
// end base prefabs

ecs.registerPrefab(Prefabs.Armor);
ecs.registerPrefab(Prefabs.Dummy);
ecs.registerPrefab(Prefabs.Floor);
ecs.registerPrefab(Prefabs.FrostPotion);
ecs.registerPrefab(Prefabs.Goblin);
ecs.registerPrefab(Prefabs.HealthPotion);
ecs.registerPrefab(Prefabs.Player);
ecs.registerPrefab(Prefabs.PoisonPotion);
ecs.registerPrefab(Prefabs.ScrollFireball);
ecs.registerPrefab(Prefabs.ScrollLightning);
ecs.registerPrefab(Prefabs.StairsDown);
ecs.registerPrefab(Prefabs.StairsUp);
ecs.registerPrefab(Prefabs.Wall);

export default ecs;
