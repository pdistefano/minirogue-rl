import ecs from "../state/ecs";
import { addLog } from "../index";
import { addCacheSet, deleteCacheSet, readCacheSet } from "../state/cache";
import { grid } from "../lib/canvas";
import { Move } from "../state/components";

const movableEntities = ecs.createQuery({
	all: [Move],
});

const attack = (entity, target) => {
	const damage = Math.max(entity.power.current - target.defense.current, 0);
	target.fireEvent("take-damage", { amount: damage });

	if (target.health.current <= 0) {
		return addLog(`${entity.description.name} kicked ${target.description.name} for ${damage} damage and killed it!`);
	}

	addLog(`${entity.description.name} kicked ${target.description.name} for ${damage} damage!`);
};

export const MovementSystem = () => {
	movableEntities.get().forEach((entity) => {
		if (entity.has("Paralyzed")) {
			return entity.remove(Move);
		}

		let mx = entity.move.x;
		let my = entity.move.y;
		let mz = entity.move.z;

		if (entity.move.relative) {
			mx = entity.position.x + entity.move.x;
			my = entity.position.y + entity.move.y;
		}

		// this is where we will run any checks to see if entity can move to new location
		// observe map boundaries
		mx = Math.min(grid.map.width + grid.map.x, Math.max(grid.map.x, mx));
		my = Math.min(grid.map.height + grid.map.y, Math.max(grid.map.y, my));

		// check for blockers
		const blockers = [];
		// read from cache
		const entitiesAtLoc = readCacheSet(
			"entitiesAtLocation",
			`${mx},${my},${mz}`
		);

		for (const eId of entitiesAtLoc) {
			let target = ecs.getEntity(eId);

			// check if target is blocking
			if (target.isBlocking) {
				blockers.push(eId);
			}

			// propagate poison
			// if (target.has("Poisoned") && entity.has("Health")) {
			// 	console.log(`Entity ${entity.id} has Poison and Health!`);
			// 	entity.add("Poisoned");
			// }
		}

		if (blockers.length) {
			blockers.forEach((eId) => {
				const target = ecs.getEntity(eId);
				if (target.has("Health") && target.has("Defense")) 
				{
					attack(entity, target);
				} else {
					addLog(`${entity.description.name} bump into a ${target.description.name}`);
				}
			});

			entity.remove(Move);
			return;
		}

		entity.remove("Position");
		entity.add("Position", { x: mx, y: my, z: mz });

		entity.remove(Move);
	});
};
