import ecs from "../state/ecs";
import { addLog } from "../index";
const { ActiveEffects } = require("../state/components");

const activeEffectsEntities = ecs.createQuery({
	all: [ActiveEffects],
});

const poison = (target) => {
	const damage = target.poisoned.damage;
	target.fireEvent("take-damage", { amount: damage });
	if (target.has("Health") && target.health.current <= 0) {
		return addLog(
			`Poison seeped into ${target.description.name}'s blood for ${damage} damage and killed it!`
		);
	}

	addLog(
		`Poison seeped into ${target.description.name}'s blood for ${damage} damage!`
	);
}

export const EffectsSystem = () => {
	activeEffectsEntities.get().forEach((entity) => {
		entity.activeEffects.forEach((c) => {
			if (entity[c.component]) {
				entity[c.component].current += c.delta;

				if (entity[c.component].current > entity[c.component].max) {
					entity[c.component].current = entity[c.component].max;
				}
			}

			if (c.events.length) {
				c.events.forEach((event) => entity.fireEvent(event.name, event.args));
			}

			// handle addComponents
			if (c.addComponents.length) {
				c.addComponents.forEach((component) => {
					if (!entity.has(component.name)) {
						entity.add(component.name, component.properties);
					}
				});
			}

			entity.add("Animate", { ...c.animate });

			if (entity.has("Poisoned")) {
				poison(entity);
			}

			if (!c.duration) {
				c.remove();

				if (c.addComponents.length) {
					c.addComponents.forEach((component) => {
						if (entity.has(component.name)) {
							entity.remove(component.name, component.properties);
						}
					});
				}
			} else {
				c.duration -= 1;
			}
		});
	});
};
