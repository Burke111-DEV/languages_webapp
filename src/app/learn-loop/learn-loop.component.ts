import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { SessionService } from '../session.service';

interface IAudioFiles {
  "en": HTMLAudioElement,
  "it": Array<HTMLAudioElement>
}

@Component({
  selector: 'app-learn-loop',
  templateUrl: './learn-loop.component.html',
  styleUrls: ['./learn-loop.component.css']
})
export class LearnLoopComponent implements OnInit {
  // private audio_path: string = "http://167.172.143.153/lang/assets/voice/";
  private audio_path: string = "https://raw.githubusercontent.com/Burke111-dev/uk.co.benmartinburke.examples/main/files/voices/";
  
  private audio_files: IAudioFiles = {"en": new Audio(), "it": []}
  
  public eng:string = "Hello";
  public ita:Array<string> = ["Hello"];
  private words: Array<string> = [];
  private translations: { [key: string]: Array<string> } = {};
  private neighbours: { [key: string]: Array<string> } = {};
  private selected_wordset: Array<string> = [];

  public timerActive: boolean = false;
  public speechActive: boolean = true;

  public list_pos:number = 0;
  public list_len:number = 100;

  private start_time: number = 0;
  private timer_count: number = 0;
  private timer_max: number = 1200000; // 20mins
  public timerWidth: string = `${this.timer_count*100 / this.timer_max}`;
  public timerVal: number = 0;

  constructor(private http: HttpClient,
              public session: SessionService) {
    this.http.get<Array<string>>("./assets/data/words.json").subscribe({
      next: (value: Array<string>) => this.words = value,
      error: (error: any) => console.log(error)
    });

    this.http.get<{ [key: string]: Array<string>}>("./assets/data/translations.json").subscribe({
      next: (value: { [key: string]: Array<string>}) => this.translations = value,
      error: (error: any) => console.log(error)
    });

    this.http.get<{ [key: string]: Array<string> }>("./assets/data/neighbours_map.json").subscribe({
      next: (value: { [key: string]: Array<string> }) => this.neighbours = value,
      error: (error: any) => console.log(error)
    });
  }

  ngOnInit(): void {    
    this.runTimer();
    setTimeout(() => {
      this.get_randomised_list()

      this.eng = this.selected_wordset[0]
      this.ita = this.translations[this.eng];
      this.get_audio_files(this.eng, this.ita)
        .then(() => {
          setTimeout(() => {
            if(this.speechActive) {
              this.speech(0);
              setTimeout(() => {
                this.speech(1);
              }, 1000);
            }
            this.autoWordTimerToggle();
          }, 1000);
          
        });

      
    }, 1000);
  }

  private get_randomised_list() {
    // console.log(this.neighbours)
    const start = Math.floor(Math.random()*848);
    this.selected_wordset.push(this.words[start])
    
    const get_next_word = () => {
      let curr_nbrs = Object.keys(this.neighbours[this.selected_wordset.slice(-1)[0]]);
      // let curr_nbrs = Object.keys(this.neighbours[this.selected_wordset.slice(-1)[0]]).map(key => Object.assign({}, this.neighbours[this.selected_wordset.slice(-1)[0]][key as unknown as number]));
      
      // If no neighbours, add a random word
      if(curr_nbrs.length == 0 ) {
        while(true) {
          let w = this.words[Math.floor(Math.random()*848)];
          if(!this.selected_wordset.includes(w)) {
            this.selected_wordset.push(w);
            break;
          }
        }
      }
      // Else, add a random neighbour
      else {
        while(true) {
          let w = curr_nbrs[Math.floor(Math.random()*curr_nbrs.length)]
          if(!this.selected_wordset.includes(w) && typeof w !== "undefined") {
            this.selected_wordset.push(w);
            break;
          }
          else {
            curr_nbrs = curr_nbrs.filter(item => item !== w);
          }
          if(curr_nbrs.length == 0) {
            while(true) {
              let w = this.words[Math.floor(Math.random()*848)];
              if(!this.selected_wordset.includes(w)) {
                this.selected_wordset.push(w);
                break;
              }
            }
            break;
          }
        }
      }
    }

    while(this.selected_wordset.length < 180) {
      get_next_word();
    }
    
    console.log("LIST:", this.selected_wordset);
  }

  private get_audio_files(ENG: string, ITA: Array<string>) {
    return new Promise((resolve, reject) => {
      this.audio_files.it = [];
      let count = 1+ITA.length;

      // English Audio
      this.http.get(`${this.audio_path}en/${ENG}.mp3`, { responseType: 'blob' }).subscribe(blob => {
        this.audio_files.en = new Audio(URL.createObjectURL(blob));
        count -= 1;
        if(!count) resolve("OK");
      });
      
      // Italian Audio
      ITA.forEach(word => {
        this.http.get(`${this.audio_path}it/${word}.mp3`, { responseType: 'blob' }).subscribe(blob => {
          this.audio_files.it.push(new Audio(URL.createObjectURL(blob)));
          count -= 1;
          if(!count) resolve("OK");
        });
      });
    });
  }

  private runTimer() {
    this.start_time = Date.now();
    let v;
    let loopRef = setInterval(() => {
      this.timer_count = Date.now() - this.start_time;
      v = this.timer_count*100 / this.timer_max;
      v = v > 100 ? 100 : v;
      this.timerWidth = `${v}`;
      this.timerVal = this.timer_max - this.timer_count;
      this.timerVal = this.timerVal < 0 ? 0 : this.timerVal;

      if(this.timer_count >= this.timer_max) clearInterval(loopRef);
    }, 250);
  }

  public autoWordTimerToggle() {
    this.timerActive = !this.timerActive;
    if(this.timerActive) {
      let word_timer_ref = setInterval(() => {
        if(!this.timerActive) {
          clearInterval(word_timer_ref);
          return;
        }
        
        this.move(1);
      }, 20*1000);
    }
  }

  public autoSpeechToggle() {
    this.speechActive = !this.speechActive;
  }

  public move(dir: number) {
    if( (dir == 0 && this.list_pos == 0) || (dir == 1 && this.list_pos >= this.words.length-1 ) ) return;
    this.list_pos += dir == 1 ? 1 : -1;

    // this.eng = this.words[this.list_pos]
    this.eng = this.selected_wordset[this.list_pos]
    this.ita = this.translations[this.eng];
    
    this.get_audio_files(this.eng, this.ita)
      .then(() => {
        if(this.speechActive) {
          this.speech(0);
          setTimeout(() => {
            this.speech(1);
          }, 1000);
        }
      });
  }

  public speech(lang: number) {
    setTimeout(() => {
      if(!lang) 
        this.audio_files.en.play();
      else {
        for(let i = 0; i<this.audio_files.it.length; i++) {
          setTimeout(() => {
            this.audio_files.it[i].play();
          }, i*1250);
        }
      }
    }, 125);
  }

  @HostListener('document:keydown.arrowleft', ['$event'])
  onArrowLeft(event: KeyboardEvent) {
    this.move(0);    
  }

  @HostListener('document:keydown.arrowright', ['$event'])
  onArrowRight(event: KeyboardEvent) {
    this.move(1);
  }
}
