import * as lessonsJson from './jsons/lessons.json';
import * as unitsJson from './jsons/units.json';

describe('Units json testing', () => {
  it('It should have an array of elements', () => {
    expect(unitsJson).toBeInstanceOf(Array);
  });

  it('It should have an array of length > 0', () => {
    expect(unitsJson.length).toBeGreaterThan(0);
  });

  it('Every unit to have a title', () => {
    for (const unit of unitsJson) {
      expect(unit).toHaveProperty('title');
    }
  });

  it('Every unit to have an examId', () => {
    for (const unit of unitsJson) {
      expect(unit).toHaveProperty('examId');
    }
  });

  it('Every units to have an array of lessonIds', () => {
    for (const unit of unitsJson) {
      expect(unit).toHaveProperty('lessonsIds');
    }
  });

  it('It should have an array lessonsIds with length > 0', () => {
    for (const unit of unitsJson) {
      expect(unit.lessonsIds.length).toBeGreaterThan(0);
    }
  });

  it('It should have existing lessonsIds', () => {
    const lessonsLength = lessonsJson.length;
    for (const unit of unitsJson) {
      for (const lessonId of unit.lessonsIds) {
        expect(lessonId).toBeLessThanOrEqual(lessonsLength);
      }
    }
  });
});
