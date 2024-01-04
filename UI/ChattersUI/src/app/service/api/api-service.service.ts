import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { User } from '../../models/user';
import { environment } from 'src/environments/environment';
import { Room } from 'src/app/models/room';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private http: HttpClient) { }

  getAllUsers():Observable<User[]>{
    return this.http.get<User[]>(`${environment.apiUrl}`);
  }

  getAllRooms():Observable<Room>{
    return this.http.get<Room>(`${environment.apiUrl}/Room`);
  }

  getOneRoom(roomId: string):Observable<Room>{
    return this.http.get<Room>(`${environment.apiUrl}/Room/` + roomId).pipe();
  }

  createRoom():Observable<string>{
    return this.http.post(`${environment.apiUrl}/Room`, null, {responseType: 'text'}).pipe(catchError(error => {
      console.log('Post request failed')
      return '';
    }))
  }


}
