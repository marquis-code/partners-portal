import mitt from 'mitt'

type Events = {
  "vehicles:assign-driver": string;
  "vehicles:unassign-driver": string;
  "vehicles:edit-vehicle": string;
  "drivers:edit-driver": string;

  "settings:go-to-profile": string;
  "settings:go-to-company": string;
  "settings:go-to-settlement": string;
};

const emitter = mitt<Events>();

export default emitter;
