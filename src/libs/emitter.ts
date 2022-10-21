import mitt from 'mitt'

type Events = {
  "drivers:assign-driver": string;
  "drivers:edit-driver": string;
};

const emitter = mitt<Events>();

export default emitter;
