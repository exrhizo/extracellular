import { dataAccessRoam } from './ecm-static-data';

describe('dataAccessRoam', () => {
  it('should work', () => {
    expect(dataAccessRoam()).toEqual('ecm-static-data');
  });
});
