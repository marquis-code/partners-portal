import mitt from 'mitt'

type Events = {
  "vehicles:assign-driver": string;
  "vehicles:unassign-driver": string;
  "vehicles:edit-vehicle": string;
  "drivers:edit-driver": string;
};

const emitter = mitt<Events>();

export default emitter;
