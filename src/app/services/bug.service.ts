import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Bug } from '../model/bug-model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root'
})
export class BugService {

  //In environment.ts is the url hosted
  bugsURL = environment.baseURL + "bugs";

  constructor(private httpClient: HttpClient) { }

  //Create a new bug
  create(data): Observable<any> {
    console.log(data)
    return this.httpClient.post(this.bugsURL, data, httpOptions);
  }

  //Get all bugs
  readAll(): Observable<Bug[]> {
    return this.httpClient.get<Bug[]>(this.bugsURL);
  }

  //Get a specific bug
  read(id): Observable<any> {
    return this.httpClient.get(`${this.bugsURL + "/bugs"}/${id}`);
  }

  //Edit a bug
  update(id, data): Observable<any> {
    return this.httpClient.put(`${this.bugsURL}/${id}`, data);
  }

  //Delete a bug
  delete(id): Observable<any> {
    console.log(id);
    return this.httpClient.delete(`${this.bugsURL}/${id}`);
  }

  //Not used, deletes all bugs
  deleteAll(): Observable<any> {
    return this.httpClient.delete(this.bugsURL + "/bugs");
  }

  //Get 10 bugs for a specific page
  paginate(pagenum: number): Observable<Bug[]> {
    return this.httpClient.get<Bug[]>(this.bugsURL + "?page=" + `${pagenum}` + "&size=10");
  }

  //We use a different way to search

  //searchByName(name): Observable<any> {
  // return this.httpClient.get(`${baseURL}?title=${name}`);
  // }
}
