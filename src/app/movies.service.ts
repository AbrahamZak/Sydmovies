import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchResults } from './searchResults.model';
import { MovieData } from './movieData.model';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(private _http: HttpClient) { }

  search(query: string){
    return this._http.get<SearchResults[]>('https://www.omdbapi.com/?s='+query+'&apikey=25b3e747');
  }

  getMovie(movie: string){
    return this._http.get<MovieData[]>('https://www.omdbapi.com/?t='+movie+'&apikey=25b3e747');
  }
  }