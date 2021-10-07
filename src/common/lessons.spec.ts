import { Test, TestingModule } from '@nestjs/testing';
import * as lessonsJson from "./jsons/lessons.json"
import * as exercisesJson from "./jsons/exercises.json"
import { config } from "./config";

describe('Lessons json testing', () => {
  it('It should have an array of elements', () => {
    expect(lessonsJson).toBeInstanceOf(Array);
  });

  it('It should have an array of length > 0', () => {
    expect(lessonsJson.length).toBeGreaterThan(0);
  });

  it('Every lessons to have a title', () => {
    for (const lessons of lessonsJson) {
      expect(lessons).toHaveProperty("title");
    }
  });

  it('Every lessons to have an array of exercises', () => {
    for (const lessons of lessonsJson) {
        expect(lessons).toHaveProperty("exercisesIds");
    }
  });

  it('It should have an array exercisesIds with length > 0', () => {
    for (const lessons of lessonsJson) {
        expect(lessons.exercisesIds.length).toBeGreaterThan(0);
    }
  });

  it('It should have an array exercisesIds with length === 8', () => {
    for (const lessons of lessonsJson) {
        expect(lessons.exercisesIds.length).toBe(config.amountOfExercisesPerLesson);
    }
  });

  it('It should have existing exercisesIds', () => {
    const exercisesLength = exercisesJson.length;
    for (const lesson of lessonsJson) {
        for (const actualExerciseId of lesson.exercisesIds) {
            expect(actualExerciseId).toBeLessThanOrEqual(exercisesLength);
        }
    }
  });
});