import box from './app.js';

const parent = () => {
  return React.createElement('div', {id: 'parent'}, box());
}

export default parent;