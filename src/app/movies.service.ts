import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchResults } from './searchResults.model';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(private _http: HttpClient) { }

  search(query: string){
    return this._http.get<SearchResults[]>('https://www.omdbapi.com/?s='+query+'&apikey=25b3e747');
  }
  }