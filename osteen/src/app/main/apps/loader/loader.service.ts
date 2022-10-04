import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable()
export class LoaderService {
    private loadCount: number = 0;
    isLoading = new Subject<boolean>();
    showtime() {
        this.loadCount=4;
        this.isLoading.next(true);
    }
    show() {
        this.isLoading.next(true);
    }
    hide() {
        this.loadCount = (this.loadCount ? --this.loadCount : 0);
        if (!this.loadCount)  this.isLoading.next(false);
       
    }
}