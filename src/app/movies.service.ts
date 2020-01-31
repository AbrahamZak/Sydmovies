import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchResults } from './searchResults.model';
import { MovieData } from './movieData.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(private _http: HttpClient,  private db: AngularFirestore) { }

  search(query: string){
    return this._http.get<SearchResults[]>('https://www.omdbapi.com/?s='+query+'&apikey=25b3e747');
  }
 
  getMovie(movie: string){
    return this._http.get<MovieData[]>('https://www.omdbapi.com/?t='+movie+'&apikey=25b3e747');
  }

  insertNewFavorite(userid: string, movieData: any){
    return this.db.doc(`Data/Favorites/${userid}/${movieData.Title}`).set({
      Title: movieData.Title,
      Poster: movieData.Poster,
      Year: movieData.Year
    })
  }

  removeFavorite(userid: string, title: string){
    return this.db.doc(`Data/Favorites/${userid}/${title}`).delete().then(function() {
  }).catch(function(error) {
      console.error("Error removing document: ", error);
  });
  }

  checkFavorite(userid: string, title: string){
     return this.db.doc(`Data/Favorites/${userid}/${title}`).get().toPromise().then(snapshot => {
      return snapshot.exists;
    });
  }

  getFavorites(userid: string){
    var favorites = [];
    this.db.collection(`Data/Favorites/${userid}`).get().toPromise()
    .then(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
      favorites.push(doc.data());
    });
  });
  return favorites;
 }
  }