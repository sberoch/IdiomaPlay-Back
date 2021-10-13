import { Test, TestingModule } from '@nestjs/testing';
import * as challengesJson from "./jsons/challenges.json"
import * as unitsJson from "./jsons/units.json"

describe('Challenges json testing', () => {
  it('It should have an array of elements', () => {
    expect(challengesJson).toBeInstanceOf(Array);
  });

  it('It should have an array of length > 0', () => {
    expect(challengesJson.length).toBeGreaterThan(0);
  });

  it('Every challenge to have an id', () => {
    for (const challenge of challengesJson) {
      expect(challenge).toHaveProperty("challengeId");
    }
  });

  it('Every challenge to have a title', () => {
    for (const challenge of challengesJson) {
      expect(challenge).toHaveProperty("title");
    }
  });

  it('Every challenge to have an array of units ids', () => {
    for (const challenge of challengesJson) {
        expect(challenge).toHaveProperty("unitsIds");
    }
  });

  it('It should have an array units with length > 0', () => {
    for (const challenge of challengesJson) {
        expect(challenge.unitsIds.length).toBeGreaterThan(0);
    }
  });

  it('It should have existing unitsIds', () => {
    const unitsLength = unitsJson.length;
    for (const challenge of challengesJson) {
        for (const actualExerciseId of challenge.unitsIds) {
            expect(actualExerciseId).toBeLessThanOrEqual(unitsLength);
        }
    }
  });
});