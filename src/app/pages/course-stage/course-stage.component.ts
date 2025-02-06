import { IStageMission } from './../../shared/interfaces/CourseInterfaces';
import { Component, type OnInit } from '@angular/core';
import { faCheck, faChevronLeft, faChevronRight, faLock, faStar } from '@fortawesome/free-solid-svg-icons';
import { MissionStatus } from '../../shared/enums/course.enum';

@Component({
  selector: 'app-course-stage',
  templateUrl: './course-stage.component.html',
  styleUrl: './course-stage.component.scss',
})
export class CourseStageComponent implements OnInit {
  lockIcon = faLock;
  doneIcon = faCheck;
  currentIcon = faStar;
  nextIcon = faChevronRight;
  prevIcon = faChevronLeft;

  demoMissions: IStageMission[] = [
    {
      id: '1',
      title: 'Introduction to Programming',
      type: 'video',
      status: MissionStatus.DONE,
      mission: 'Watch a video explaining the basics of programming.',
      time: 10,
    },
    {
      id: '2',
      title: 'Understanding Variables',
      type: 'document',
      status: MissionStatus.CURRENT,
      mission:
        'Read a document about different types of variables and their usage.',
      time: 15,
    },
    {
      id: '3',
      title: 'Loops and Iterations Quiz',
      type: 'quiz',
      status: MissionStatus.LOCKED,
      mission:
        'Answer a quiz to test your knowledge about loops and iterations.',
      time: 5,
    },
    {
      id: '4',
      title: 'Functions and Scope',
      status: MissionStatus.LOCKED,
      type: 'video',
      mission: 'Watch a video explaining functions, parameters, and scope.',
      time: 20,
    },
    {
      id: '5',
      title: 'Object-Oriented Programming Basics',
      status: MissionStatus.LOCKED,
      type: 'document',
      mission: 'Read a document covering the basics of OOP concepts.',
      time: 25,
    },
    {
      id: '6',
      title: 'Object-Oriented Programming Basics',
      status: MissionStatus.LOCKED,
      type: 'document',
      mission: 'Read a document covering the basics of OOP concepts.',
      time: 25,
    },
    {
      id: '7',
      title: 'Object-Oriented Programming Basics',
      status: MissionStatus.LOCKED,
      type: 'document',
      mission: 'Read a document covering the basics of OOP concepts.',
      time: 25,
    },
    {
      id: '8',
      title: 'Object-Oriented Programming Basics',
      status: MissionStatus.LOCKED,
      type: 'document',
      mission: 'Read a document covering the basics of OOP concepts.',
      time: 25,
    },
    {
      id: '9',
      title: 'Object-Oriented Programming Basics',
      status: MissionStatus.LOCKED,
      type: 'document',
      mission: 'Read a document covering the basics of OOP concepts.',
      time: 25,
    },
  ];

  rows: any[] = [];

  totalStages = 3;
  currentStage = 1;

  constructor() {}

  ngOnInit(): void {
    this.initRow();
  }

  initRow() {
    const itemPerRow = 4;
    this.rows = Array(Math.ceil(this.demoMissions.length / itemPerRow));

    this.demoMissions.forEach((mission, index) => {
      const row = Math.floor(index / itemPerRow);
      if (!this.rows[row]) {
        this.rows[row] = [];
      }

      this.rows[row].push({
        ...mission,
        ...this.setIconToMission(mission.status as MissionStatus),
      });
    });

    for (let i = this.rows[this.rows.length - 1].length; i < itemPerRow; i++) {
      this.rows[this.rows.length - 1].push(null);
    }
  }

  updateCurrentStage(value: number) {
    this.currentStage += value;
  }

  getRowLength(row: any[]) {
    let count = 0;
    row.forEach((item) => {
      if (item) {
        count++;
      }
    });

    return count;
  }

  setIconToMission(status: MissionStatus) {
    switch (status) {
      case MissionStatus.DONE:
        return {
          icon: this.doneIcon,
          class: 'done',
        };
      case MissionStatus.CURRENT:
        return {
          icon: this.currentIcon,
          class: '',
        };
      case MissionStatus.LOCKED:
      default:
        return {
          icon: this.lockIcon,
          class: 'locked',
        };
    }
  }
}
