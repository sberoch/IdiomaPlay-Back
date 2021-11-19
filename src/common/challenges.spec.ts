import * as challengesJson from './jsons/challenges.json';

describe('Challenges json testing', () => {
  it('It should be an array of elements', () => {
    expect(challengesJson).toBeInstanceOf(Array);
  });

  it('It should be an array of length > 0', () => {
    expect(challengesJson.length).toBeGreaterThan(0);
  });

  it('Every challenge to have a title', () => {
    for (const challenge of challengesJson) {
      expect(challenge).toHaveProperty('title');
    }
  });

  it('Every challenge to have an array of units', () => {
    for (const challenge of challengesJson) {
      expect(challenge).toHaveProperty('units');
    }
  });

  it('It should have an array units with length > 0', () => {
    for (const challenge of challengesJson) {
      expect(challenge.units.length).toBeGreaterThan(0);
    }
  });
});
