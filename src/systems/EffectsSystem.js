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
// TODO: Fix the Active Effects system that keeps adding the same component
// and stores the effects weirdly. Active effects have "addComponents", which tells 
// me it should remove them after they have been added. Something is not right.
export const EffectsSystem = () => {
	activeEffectsEntities.get().forEach((entity) => {
		entity.activeEffects.forEach((activeEffect) => {
			if (entity[activeEffect.component]) {
				entity[activeEffect.component].current += activeEffect.delta;

				if (entity[activeEffect.component].current > entity[activeEffect.component].max) {
					entity[activeEffect.component].current = entity[activeEffect.component].max;
				}
			}

			if (activeEffect.events.length) {
				activeEffect.events.forEach((event) => entity.fireEvent(event.name, event.args));
			}

			// handle addComponents
			if (activeEffect.addComponents.length) {
				activeEffect.addComponents.forEach((component) => {
					
					if (!entity.has(component.name)) {

						let baseComponent = ecs.components.get(component.name);

						// merge base component properties with component properties
						// Currently, Active Effects are using the properties imparted by the 
						// prefab active effect, but don't have the properties of the base component.
						// To me it makes sense to have a base Component, with its properties, and then
						// have the prefab effect override certain props to make it unique.
						component.properties = { ...baseComponent.properties, ...component.properties };

						if (component.properties.onlyAppliesTo) {
							if (entity.has(component.properties.onlyAppliesTo[0]))
							{
								entity.add(component.name, component.properties);
							}
						}
						else {
							console.warn(`${component.name} added to ${entity.description.name}`)
							entity.add(component.name, component.properties);
						}
					}
				});
			}

			if (entity.has("Poisoned") && entity.has("IsLiveBeing")) {
				poison(entity);
				// Only animate if the entity == Poisoned + isLiveBeing
				entity.add("Animate", { ...activeEffect.animate }); 
			}

			if (!activeEffect.duration) {
				activeEffect.remove();

				if (activeEffect.addComponents.length) {
					activeEffect.addComponents.forEach((component) => {
						if (entity.has(component.name)) {
							entity.remove(component.name, component.properties);
						}
					});
				}
			} else {
				activeEffect.duration -= 1;
			}
		});
	});
};
