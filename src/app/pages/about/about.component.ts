import { Component, OnInit } from '@angular/core';
import { faBook, faBullseye, faGift, faGlobe, faHandshake, faPeopleArrows, faSeedling } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  whatDifferentItems = [
    {
      title: 'LABEL.NO_BORING_SESSION',
      content: 'LABEL.NO_BORING_SESSION_CONTENT',
      icon: faGift
    },
    {
      title: 'LABEL.NO_ONE_SIZE_FIT',
      content: 'LABEL.NO_ONE_SIZE_FIT_CONTENT',
      icon: faGlobe
    },
    {
      title: 'LABEL.NO_ISOLATE_LEARNING',
      content: 'LABEL.NO_ISOLATE_LEARNING_CONTENT',
      icon: faBook
    }
  ]

  ourValuesItems = [
    {
      title: 'LABEL.ENAGEMENT_FIRST',
      content: 'LABEL.ENAGEMENT_FIRST_CONTENT',
      icon: faPeopleArrows
    },
    {
      title: 'LABEL.GOAL_ORIENTED',
      content: 'LABEL.GOAL_ORIENTED_CONTENT',
      icon: faBullseye
    },
    {
      title: 'LABEL.COMMUNITY_COLLAB',
      content: 'LABEL.COMMUNITY_COLLAB_CONTENT',
      icon: faHandshake
    },
    {
      title: 'LABEL.CONTINUOUS_INNOVATION',
      content: 'LABEL.CONTINUOUS_INNOVATION_CONTENT',
      icon: faSeedling
    },
  ]

  constructor() { }

  ngOnInit() {
  }

}
