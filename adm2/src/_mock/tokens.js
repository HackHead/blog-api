import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const tokens = [...Array(24)].map((_, index) => ({
  iuuid: faker.datatype.uuid(),
  name: faker.name.findName(),
  description: faker.lorem.sentence(),
  createdAt: faker.date.past(),
  lastUsed: faker.date.recent(),
}));

export default tokens;
