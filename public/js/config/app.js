import { v4 as uuidv4 } from 'uuid';

let id;

function getAppId() {
  if (!id) {
    const urlParams = new window.URLSearchParams(window.location.search);
    const instanceId = urlParams.get('instanceUuid');
    id = instanceId || uuidv4();
  }

  return id;
}

export default {
  app: {
    id: getAppId()
  },
  defaults: {
    pokemon: {
      id: 149,
      name: 'dragonite'
    }
  },
  popular: {
    ids: [25, 137]
  },
  window: {
    storage: {
      instanceUUID: 'raichu-min-armoury-crate-instance-uuid',
      instanceKey: 'raichu-min-armoury-crate-open-instances',
      instancePrime: 'raichu-min-armoury-crate-instance-prime'
    }
  }
};
