import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';
import { Hotel } from 'src/app/model/hotel.interface';

export interface UserData {
  items: Hotel[],
  // meta: {
  //   totalItems: number;
  //   itemCount: number;
  //   itemsPerPage: number;
  //   totalPages: number;
  //   currentPage: number;
  // }, 
  // links: {
  //   first: string;
  //   previous: string;
  //   next: string;
  //   last: string;
  // }
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
   private StationIdSource = new BehaviorSubject(0);
  currentStationId = this.StationIdSource.asObservable();

  private ColumnIdSource = new BehaviorSubject(0);
  currentColumnId = this.ColumnIdSource.asObservable();
  
  constructor(private http: HttpClient) { }

  findOne(id: number, activeUser): Observable<Hotel> {
    
    return this.http.get(`/api/${activeUser}/` + id).pipe(
      map((hotel:Hotel) => hotel)
    )
  }

  updateOne(id, data, activeUser): Observable<Hotel> {  
    console.log(activeUser);
    
    return this.http.put(`api/${activeUser}/` + id, {'reserveddate': data[0], reservedcarnumbers: data[1]});
  }

  changeStationId(id: number) {
    this.StationIdSource.next(id)
  }

  changeColumnId(id: number) {
    this.ColumnIdSource.next(id)
  }

  findAll(): Observable<UserData> {
    // let params = new HttpParams();

    // params = params.append('page', String(page));
    // params = params.append('limit', String(size));

    return this.http.get('/api/hotels').pipe(
      map((userData: UserData) => userData),
      catchError(err => throwError(err))
    )    
  }

  findAllCustomers(): Observable<UserData> {
    // let params = new HttpParams();

    // params = params.append('page', String(page));
    // params = params.append('limit', String(size));

    return this.http.get('/api/customers').pipe(
      map((userData: UserData) => userData),
      catchError(err => throwError(err))
    )    
  }

  isHotel(): Observable<Hotel> {
    return this.http.get('/api/hotels/').pipe(
      filter((hotel:Hotel) => hotel.role === 'hotel' )
    )
  }

  // uploadProfileImage(formData: FormData): Observable<any> {
  //   return this.http.post<FormData>('/api/users/upload', formData, {
  //     reportProgress: true,
  //     observe: 'events'
  //   })
  // }

  // paginateByName(page: number, size: number, username: string): Observable<UserData> {
  //   let params = new HttpParams();

  //   params = params.append('page', String(page));
  //   params = params.append('limit', String(size));
  //   params = params.append('username', username);

  //   return this.http.get('/api/users', {params}).pipe(
  //     map((userData: UserData) => userData),
  //     catchError(err => throwError(err))
  //   )
  // }
}
