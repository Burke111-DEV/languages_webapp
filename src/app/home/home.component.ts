import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public pulse: boolean = false;
  public fade: boolean = false;

  constructor(public session: SessionService,
              private router: Router) { }

  ngOnInit(): void {
  }

  public go(where: string) {
    this.pulse = true;
    setTimeout(() => this.pulse = false, 1050);
    
    setTimeout(() => this.fade = true, 1000);

    setTimeout(() => this.router.navigate(['/learn']), 2000);
  }
}
