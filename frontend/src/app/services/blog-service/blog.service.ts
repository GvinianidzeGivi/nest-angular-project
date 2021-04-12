import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { BlogEntriesPageable, BlogEntry } from 'src/app/model/blog-entry.interface';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }

  findOne(id: number): Observable<BlogEntry> {
    return this.http.get<BlogEntry>('/api/blog-entries/' + id);
  }

  indexAll(): Observable<BlogEntriesPageable> {
    let params = new HttpParams();

    // params = params.append('page', String(page));
    // params = params.append('limit', String(limit));

    return this.http.get<BlogEntriesPageable>('/api/blog-entries');
  }

  indexByUser(userId: number): Observable<BlogEntriesPageable> {
    
    // let params = new HttpParams();

    // params = params.append('page', String(page));
    // params = params.append('limit', String(limit));

    return this.http.get<BlogEntriesPageable>('/api/blog-entries/user/' + userId)
  }

  post(choosenDate, reservedHotel): Observable<any> {
    return this.http.post<any>('/api/blog-entries', {reserveddate: choosenDate, hotelinfo: reservedHotel});
  }

  updateByPost(stationId: number, obj): Observable<BlogEntry> {
    console.log(stationId);
    
    return this.http.put<BlogEntry>(`/api/blog-entries/status/${stationId}`, 
    {
      paragraphs: [obj.user, obj.reserveddate],
      "isreserved": true
    },
    );
  }

  delete(id: number): Observable<number> {
    return this.http.delete<number>(`/api/blog-entries/${id}`)
  }

  

  uploadHeaderImage(formData: FormData): Observable<any> {
    return this.http.post<FormData>('/api/blog-entries/image/upload', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

}
