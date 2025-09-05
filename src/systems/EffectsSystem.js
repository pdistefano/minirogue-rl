import ecs from "../state/ecs";
import { addLog } from "../index";
const { ActiveEffects } = require("../state/components");

const activeEffectsEntities = ecs.createQuery({
	all: [ActiveEffects],
});

const poisonEffectEntities = ecs.createQuery({all: ["Poisoned", "IsLiveBeing"]});
const paralyzedEffectEntities = ecs.createQuery({all: ["Paralyzed"]});
const frostedEffectEntities = ecs.createQuery({all: ["Frosted", "IsLiveBeing"]});

const ApplyPoisonToTarget = (target) =>
{
	const damage = target.poisoned.damage;
	target.poisoned.duration -= 1;
	target.add("Animate", { color: "#00ff00", duration: 1000 });

	target.fireEvent("take-damage", { amount: damage });
	if (target.has("Health") && target.health.current <= 0)
	{
		target.remove("Poisoned");
		return addLog(`Poison seeped into ${target.description.name}'s blood for ${damage} damage and killed it!`);
	}

	addLog(`Poison seeped into ${target.description.name}'s blood for ${damage} damage!`);

	if (target.poisoned.duration <= 0)
	{
		target.remove("Poisoned");
		return addLog(`${target.description.name} is no longer poisoned.`);
	}
}

const ApplyParalysisToTarget = (target) =>
{
	target.paralyzed.duration -= 1;	

	if (target.paralyzed.duration <= 0)
	{
		target.remove("Paralyzed");
		return addLog(`${target.description.name} can move again.`);
	}
	addLog(`${target.description.name} is paralyzed and cannot move!`);
}

const ApplyFrostToTarget = (target) =>
{
	target.frosted.duration -= 1;

	if (target.frosted.duration <= 0)
	{
		target.remove("Frosted");
		return addLog(`${target.description.name} is no longer frosted.`);
	}

	addLog(`${target.description.name} is frozen in place!`);
}

// TODO: Fix the Active Effects system that keeps adding the same component
// and stores the effects weirdly. Active effects have "addComponents", which tells 
// me it should remove them after they have been added. Something is not right.
export const EffectsSystem = () =>
{

	poisonEffectEntities.get().forEach((entity) => ApplyPoisonToTarget(entity));
	paralyzedEffectEntities.get().forEach((entity) => ApplyParalysisToTarget(entity));
	frostedEffectEntities.get().forEach((entity) => ApplyFrostToTarget(entity));

	// activeEffectsEntities.get().forEach((entity) =>
	// {
		// entity.activeEffects.forEach((activeEffect) =>
		// {
		// 	let currActiveEffectComponent = entity[activeEffect.component];
		// 	if (currActiveEffectComponent)
		// 	{
		// 		currActiveEffectComponent.current += activeEffect.delta;

		// 		currActiveEffectComponent.current = Math.min(currActiveEffectComponent.current, currActiveEffectComponent.max);
		// 	}

		// 	if (activeEffect.events.length)
		// 	{
		// 		activeEffect.events.forEach((event) => entity.fireEvent(event.name, event.args));
		// 	}

		// 	// handle addComponents
		// 	if (activeEffect.addComponents.length)
		// 	{
		// 		activeEffect.addComponents.forEach((component) =>
		// 		{

		// 			if (!entity.has(component.name))
		// 			{

		// 				let baseComponent = ecs.components.get(component.name);

		// 				// merge base component properties with component properties
		// 				// Currently, Active Effects are using the properties imparted by the 
		// 				// prefab active effect, but don't have the properties of the base component.
		// 				// To me it makes sense to have a base Component, with its properties, and then
		// 				// have the prefab effect override certain props to make it unique.
		// 				component.properties = { ...baseComponent.properties, ...component.properties };

		// 				if (component.properties.onlyAppliesTo)
		// 				{
		// 					for (let i = 0; i < component.properties.onlyAppliesTo.length; i++)
		// 					{
		// 						if (entity.has(component.properties.onlyAppliesTo[i]))
		// 						{
		// 							entity.add(component.name, component.properties);
		// 							break;
		// 						}
		// 					}
		// 				}
		// 				else
		// 				{
		// 					console.warn(`${component.name} added to ${entity.description.name}`)
		// 					entity.add(component.name, component.properties);
		// 				}
		// 			}
		// 		});
		// 	}

		// 	if (entity.has("Poisoned") && entity.has("IsLiveBeing"))
		// 	{
		// 		ApplyPoisonToTarget(entity);
		// 		entity.add("Animate", { ...activeEffect.animate });
		// 	}

		// 	if (entity.has("Frosted") && entity.has("IsLiveBeing"))
		// 	{
		// 		ApplyFrostToTarget(entity);
		// 		entity.add("Animate", { ...activeEffect.animate });
		// 	}

		// 	if (!activeEffect.duration)
		// 	{
		// 		activeEffect.remove();

		// 		if (activeEffect.addComponents.length)
		// 		{
		// 			activeEffect.addComponents.forEach((component) =>
		// 			{
		// 				if (entity.has(component.name))
		// 				{
		// 					entity.remove(component.name, component.properties);
		// 				}
		// 			});
		// 		}
		// 	} else
		// 	{
		// 		activeEffect.duration -= 1;
		// 	}
		// });
	
};
