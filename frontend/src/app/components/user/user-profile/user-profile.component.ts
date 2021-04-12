import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user-service/user.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { Hotel } from 'src/app/model/hotel.interface';
import { BlogEntriesPageable } from 'src/app/model/blog-entry.interface';
import { BlogService } from 'src/app/services/blog-service/blog.service';
import { PageEvent } from '@angular/material/paginator';
import { WINDOW } from 'src/app/window-token';
import { Inject } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  origin = this.window.location.origin;
  userRole: string;

 

  private userId$: Observable<number> = this.activatedRoute.params.pipe(
    map((params: Params) => parseInt(params['id']))
  )

  user$: Observable<Hotel> = this.userId$.pipe(
    switchMap((userId: number) => this.userService.findOne(userId, this.userRole))
  )

  blogEntries$: Observable<BlogEntriesPageable> = this.userId$.pipe(
    switchMap((userId: number) => this.blogService.indexByUser(userId))
  )

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private blogService: BlogService,
    private authService: AuthenticationService,
    @Inject(WINDOW) private window: Window
  ) { }

  ngOnInit() {
    this.authService.myData.subscribe((data) => {
      this.userRole = data;
     });
  }

  onPaginateChange(event: PageEvent) {
    return this.userId$.pipe(
      tap((userId: number) => this.blogEntries$ = this.blogService.indexByUser(userId))
    ).subscribe();
  }
}
