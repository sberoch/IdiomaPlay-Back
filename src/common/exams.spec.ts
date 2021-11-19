import * as examsJson from './jsons/exams.json';
import * as exercisesJson from './jsons/exercises.json';

describe('Exams json testing', () => {
  it('It should have an array of elements', () => {
    expect(examsJson).toBeInstanceOf(Array);
  });

  it('It should have an array of length > 0', () => {
    expect(examsJson.length).toBeGreaterThan(0);
  });

  it('Every exam to have an id', () => {
    for (const exam of examsJson) {
      expect(exam).toHaveProperty('examId');
    }
  });

  it('Every exam to have a title', () => {
    for (const exam of examsJson) {
      expect(exam).toHaveProperty('title');
    }
  });

  it('Every exams to have an array of exercises ids from lessons', () => {
    for (const exam of examsJson) {
      expect(exam).toHaveProperty('exercisesFromLessonsIds');
    }
  });

  it('It should have an array exercisesFromLessonsIds with length > 0', () => {
    for (const exam of examsJson) {
      expect(exam.exercisesFromLessonsIds.length).toBeGreaterThan(0);
    }
  });

  it('It should have an array exercisesFromLessonsIds with length greater than 16', () => {
    for (const exam of examsJson) {
      expect(exam.exercisesFromLessonsIds.length).toBeGreaterThanOrEqual(16);
    }
  });

  it('It should have existing exercisesIds', () => {
    const exercisesLength = exercisesJson.length;
    for (const exam of examsJson) {
      for (const actualExerciseId of exam.exercisesFromLessonsIds) {
        expect(actualExerciseId).toBeLessThanOrEqual(exercisesLength);
      }
    }
  });
});
