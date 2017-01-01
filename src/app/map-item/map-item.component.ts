import { Component, OnInit, OnChanges, SimpleChanges, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-map-item',
  outputs: ['questionBeenAsked', 'playSound'],
  templateUrl: './map-item.component.html',
  styleUrls: ['./map-item.component.scss']
})
export class MapItemComponent implements OnInit, OnChanges {
  @Input() userLanguage: string; // Browser language
  @Input() person: Object; // Item on a map representing a person
  @Input() content: Array<Object>; // Array of requests/responses
  @Input() timeouts: Array<Object>;
  @Input() index: number;
  @Input() questionBeenAnswered: Object;

  opacity: number;
  fade: boolean;
  shake: boolean;
  request: Object;
  responseId: number;
  showRequestBubble: boolean;
  showResponseBubble: boolean;
  questionBeenAsked: EventEmitter<Object>;
  playSound: EventEmitter<number>;

  constructor() {
    this.questionBeenAsked = new EventEmitter();
    this.playSound = new EventEmitter();
    this.showRequestBubble = false;
    this.showResponseBubble = false;
    
  }

  ngOnInit() {
    // Persons avatars fade-in with random delay
    setTimeout(()=>{
      this.opacity = 1;
    }, Math.floor(Math.random() * 900) + 1 )

    this.request = this.content[this.person['requestId']];
    this.responseId = 0;
  }

  clickOnPerson() {

    // clear all previous animations
    for (var i=0; i<this.timeouts.length; i++) {
      if (this.timeouts[i]) {
        clearTimeout(this.timeouts[i]);
      }      
    }
    
    // reset
    this.fade = false;

    this.showRequestBubble = true;
    this.questionBeenAsked.emit({'senderIndex': this.index, 'requestId': this.person['requestId']});
  }

  clickOnResponseBubble() {
    console.log('clickOnResponse');
    this.playSound.emit(this.responseId);
  }

  // Every person listens for questions
  ngOnChanges(changes: SimpleChanges) {

    let answer = changes['questionBeenAnswered'];

    if (answer.currentValue) {

      // hide all people apart from the sender
      if (answer.currentValue['senderIndex'] !== this.index) {
        this.fade = true;
        this.showRequestBubble = false;
        this.showResponseBubble = false;
        this.shake = false;
      }

      // check if person has answer to request
      if (this.person['responseIds'].indexOf(answer.currentValue['requestId']) >= 0) {
         
        // update response bubble content       
        this.responseId = answer.currentValue['requestId']

        // animate person
        this.timeouts.push(
          setTimeout(()=>{
              this.fade = false;
              this.shake = true;
          }, 1200)
        )

        // show bubble
        this.timeouts.push(
          setTimeout(()=>{
            this.showResponseBubble = true;
          }, 2400)
        )
      }
    }

    // let cur  = JSON.stringify(answer.currentValue);
    // let prev = JSON.stringify(answer.previousValue);
    // console.log('cur='+cur, 'prev='+prev);
    

    // if (cur['senderIndex'] !== this.index) {
    //   this.fade = true;
    // }
  }


}
