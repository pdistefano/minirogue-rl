import ecs from "../state/ecs";
import { addLog } from "../index";
const { ActiveEffects } = require("../state/components");

const activeEffectsEntities = ecs.createQuery({
	all: [ActiveEffects],
});

const ApplyPoisonToTarget = (target) =>
{
	const damage = target.poisoned.damage;
	target.fireEvent("take-damage", { amount: damage });
	if (target.has("Health") && target.health.current <= 0)
	{
		return addLog(`Poison seeped into ${target.description.name}'s blood for ${damage} damage and killed it!`);
	}

	addLog(`Poison seeped into ${target.description.name}'s blood for ${damage} damage!`);
}

const ApplyFrostToTarget = (target) =>
{
	if (target)
	{
		addLog(`${target.description.name} is frozen in place!`);
	}
}

// TODO: Fix the Active Effects system that keeps adding the same component
// and stores the effects weirdly. Active effects have "addComponents", which tells 
// me it should remove them after they have been added. Something is not right.
export const EffectsSystem = () =>
{
	activeEffectsEntities.get().forEach((entity) =>
	{
		entity.activeEffects.forEach((activeEffect) =>
		{
			let currActiveEffectComponent = entity[activeEffect.component];
			if (currActiveEffectComponent)
			{
				currActiveEffectComponent.current += activeEffect.delta;

				currActiveEffectComponent.current = Math.min(currActiveEffectComponent.current, currActiveEffectComponent.max);
			}

			if (activeEffect.events.length)
			{
				activeEffect.events.forEach((event) => entity.fireEvent(event.name, event.args));
			}

			// handle addComponents
			if (activeEffect.addComponents.length)
			{
				activeEffect.addComponents.forEach((component) =>
				{

					if (!entity.has(component.name))
					{

						let baseComponent = ecs.components.get(component.name);

						// merge base component properties with component properties
						// Currently, Active Effects are using the properties imparted by the 
						// prefab active effect, but don't have the properties of the base component.
						// To me it makes sense to have a base Component, with its properties, and then
						// have the prefab effect override certain props to make it unique.
						component.properties = { ...baseComponent.properties, ...component.properties };

						if (component.properties.onlyAppliesTo)
						{
							for (let i = 0; i < component.properties.onlyAppliesTo.length; i++)
							{
								if (entity.has(component.properties.onlyAppliesTo[i]))
								{
									entity.add(component.name, component.properties);
									break;
								}
							}
						}
						else
						{
							console.warn(`${component.name} added to ${entity.description.name}`)
							entity.add(component.name, component.properties);
						}
					}
				});
			}

			if (entity.has("Poisoned") && entity.has("IsLiveBeing"))
			{
				ApplyPoisonToTarget(entity);
				entity.add("Animate", { ...activeEffect.animate });
			}

			if (entity.has("Frosted") && entity.has("IsLiveBeing"))
			{
				ApplyFrostToTarget(entity);
				entity.add("Animate", { ...activeEffect.animate });
			}

			if (!activeEffect.duration)
			{
				activeEffect.remove();

				if (activeEffect.addComponents.length)
				{
					activeEffect.addComponents.forEach((component) =>
					{
						if (entity.has(component.name))
						{
							entity.remove(component.name, component.properties);
						}
					});
				}
			} else
			{
				activeEffect.duration -= 1;
			}
		});
	});
};
