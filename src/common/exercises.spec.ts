import { ExerciseType } from '../exercises/entities/exercise.entity';
import { config } from './config';
import * as exercisesJson from './jsons/exercises.json';

describe('Exercises json testing', () => {
  it('It should have an array of elements', () => {
    expect(exercisesJson).toBeInstanceOf(Array);
  });

  it('It should have an array of length > 0', () => {
    expect(exercisesJson.length).toBeGreaterThan(0);
  });

  it('Every exercise to have a title', () => {
    for (const exercise of exercisesJson) {
      expect(exercise).toHaveProperty('title');
    }
  });

  it('Every exercise to have a sentence', () => {
    for (const exercise of exercisesJson) {
      expect(exercise).toHaveProperty('sentence');
    }
  });

  it('Every exercise to have options', () => {
    for (const exercise of exercisesJson) {
      expect(exercise).toHaveProperty('options');
    }
  });

  it('Every exercise to have options with length > 0', () => {
    for (const exercise of exercisesJson) {
      expect(exercise.options.length).toBeGreaterThan(0);
    }
  });

  it('Every exercise to have a correct option defined', () => {
    for (const exercise of exercisesJson) {
      expect(exercise).toHaveProperty('correctOption');
    }
  });

  it('Every exercise to have a correct option in the options array', () => {
    for (const exercise of exercisesJson) {
      const foundOption = exercise.options.find(
        (actualOption) => actualOption === exercise.correctOption,
      );
      expect(foundOption).toBeDefined();
    }
  });

  it('Every exercise of type "complete" should have 4 options', () => {
    const completingExercises = exercisesJson.filter(
      (exercise) => exercise.type === ExerciseType.COMPLETE,
    );
    for (const actualCompleteExercise of completingExercises) {
      expect(
        actualCompleteExercise.options.length ===
          config.amountOfOptionsPerCompletingExercise,
      );
    }
  });

  it('Every exercise of listening and translation should have 6 options', () => {
    const notCompletingExercises = exercisesJson.filter(
      (exercise) => exercise.type !== ExerciseType.COMPLETE,
    );
    for (const exercise of notCompletingExercises) {
      expect(
        exercise.options.length ===
          config.amountOfOptionsPerListeningAndTranslatingExercise,
      );
    }
  });
});
