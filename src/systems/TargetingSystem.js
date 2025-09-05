import ecs from "../state/ecs";
import { addLog } from "../index";
import { readCacheSet } from "../state/cache";

import { Target, TargetingItem } from "../state/components";

const targetingEntities = ecs.createQuery({
	all: [Target, TargetingItem],
});

export const TargetingSystem = () =>
{
	targetingEntities.get().forEach((entity) =>
	{
		const { item } = entity.targetingItem;

		if (item && item.has("EffectsAsset"))
		{
			entity.target.forEach((t) =>
			{
				const targets = readCacheSet("entitiesAtLocation", t.locId);

				targets.forEach((eId) =>
				{
					const target = ecs.getEntity(eId);
					if (target.isInFov && item.has("EffectsAsset")) 
					{
						for (const comp of item.get("EffectsAsset").components) 
						{
							if (!target.has(comp.type)) 
							{
								if (comp.properties)
								{
									target.add(comp.type, comp.properties);
								}
								else
								{
									target.add(comp.type);
								}
							}
						}
					}
				});
			});

			entity.remove("Target");
			entity.remove("TargetingItem");

			addLog(`You used ${item.description.name}`);

			item.destroy();
		}
	});
};
