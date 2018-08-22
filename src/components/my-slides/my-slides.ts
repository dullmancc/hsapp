import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
/**
 * Generated class for the MySlidesComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'my-slides',
  templateUrl: 'my-slides.html'
})
export class MySlidesComponent {
  @ViewChild('myslides') slides: Slides;
  name:string;
  text: string;
  len:number;
  Slides_Img:string[];
  bar_selected:string[];
  mySlideOptions = {
    pager:true
  };
  constructor() {
    console.log('MySlides');
    this.text = 'Hello World';
    this.name = 'Hello';
    this.Slides_Img=[
                        'assets/imgs/example-slide-1.jpg',
                        'assets/imgs/example-slide-2.jpg',
                        'assets/imgs/example-slide-3.jpg',
                        'assets/imgs/example-slide-4.jpg',
                        'assets/imgs/example-slide-1.jpg'
                      ];
    this.bar_selected=[
                          'assets/imgs/bar_red.png',
                          'assets/imgs/bar_gray.png',
                          'assets/imgs/bar_gray.png',
                          'assets/imgs/bar_gray.png',
                          'assets/imgs/bar_gray.png'
                        ];
    // this.GetMyPos();
  }
  ngAfterViewInit() {
    this.len = this.Slides_Img.length;
    this.slides.autoplay = 1000;
    this.slides.loop = true;
    this.slides.speed = 1000;
    this.slides.freeMode = true;
    this.slides.initialSlide = 0;
    this.slides.effect= 'fade';
    this.slides.paginationType = 'bullets';
    this.slides.pager = true;
    console.dir(this.slides);
    //this.slides.startAutoplay();
  }

  slideChanged(){
    let currentIndex = (this.slides.getActiveIndex()-1)%5;
    let preIndex =( this.slides.getPreviousIndex()-1)%5;
    if(preIndex<0||currentIndex==5){
      return;
    }
    let temp = this.bar_selected[preIndex];
    this.bar_selected[preIndex] = this.bar_selected[currentIndex];
    this.bar_selected[currentIndex] = temp;
  }
  barChanged(i){
    this.slides.slideTo(i, 500);
  }
}
