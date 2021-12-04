import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOperator, LessThan, MoreThan, Repository } from 'typeorm';
import { CreateExamStatDto } from './dto/create-stat.dto';
import { StatsParams } from './dto/stats.params';
import { ExamStat } from './entities/exam-stat.entity';
import { UnitStat } from './entities/unit-stat.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(ExamStat)
    private examStatsRepository: Repository<ExamStat>,
    @InjectRepository(UnitStat)
    private unitStatsRepository: Repository<UnitStat>,
  ) {}

  async createExamStat(createExamStatDto: CreateExamStatDto) {
    return await this.examStatsRepository.save(new ExamStat(createExamStatDto));
  }
  async increasePassedUnits() {
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const todayStat = await this.unitStatsRepository.findOne({
      where: { date: today },
    });
    if (!todayStat) {
      return await this.unitStatsRepository.save({
        date: today,
        dailyPassedUnits: 1,
      });
    } else {
      todayStat.dailyPassedUnits += 1;
      return await this.unitStatsRepository.save(todayStat);
    }
  }

  async getMeanTimeForExams(params: StatsParams) {
    const dateQuery = this.buildQuery(params);
    const examStats = await this.examStatsRepository.find(dateQuery);
    const sum = examStats.map((e) => e.examTime).reduce((a, b) => a + b, 0);
    if (examStats.length === 0) {
      return 0;
    }
    return Math.round(sum / examStats.length);
  }

  getDailyActiveUsers(params: StatsParams) {
    const dateQuery = this.buildQuery(params);
    throw new Error('Method not implemented.');
  }

  async getDailyCompletedUnits(params: StatsParams) {
    const dateQuery = this.buildQuery(params);
    return (await this.unitStatsRepository.find(dateQuery)).map((u) => ({
      date: u.date,
      dailyPassedUnits: u.dailyPassedUnits,
    }));
  }

  getAccessFrecuency(params: StatsParams) {
    const dateQuery = this.buildQuery(params);
    throw new Error('Method not implemented.');
  }

  private buildQuery(params: StatsParams) {
    let dateQuery: FindOperator<Date>;
    if (params.from) {
      dateQuery = MoreThan(params.from);
    }
    if (params.to) {
      dateQuery = LessThan(params.to);
    }
    if (params.from && params.to) {
      dateQuery = Between(params.from, params.to);
    }
    if (!dateQuery) return {};
    return { where: { createdDate: dateQuery } };
  }
}
