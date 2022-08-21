import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppService } from '../app.service';
import {Component, OnInit } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  /** Based on the screen size, switch from standard to one column per row */
  cards = [];
  cardsForHandset= [];
  cardsForWeb = [];
  isHandset: boolean = false;
  isHandsetObserver: Observable<boolean>= this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return true
      }

      return false
    })
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    public appService: AppService

  ) {}

  ngOnInit() {
    this.isHandsetObserver.subscribe(currentObserverValue => {
      this.isHandset = currentObserverValue;
    })
    this.loadCards()
    this.appService.getDeals().subscribe( response => {
      this.cardsForHandset = response.handsetCards;
      this.cardsForWeb = response.webCards;
      this.loadCards()
    }, error => {
      alert("There was an error retrieving data from server, please try again!")
    })
  }

  loadCards() {
    this.cards = this.isHandset ? this.cardsForHandset : this.cardsForWeb
  }

  getImage(imageName: string) {
    return 'url(' + "http://localhost:3000/images/" + imageName + '.jpeg' + ')'
  }
}
