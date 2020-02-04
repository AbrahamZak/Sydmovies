//All services related to movies

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

  //Search for a movie (with API)
  search(query: string){
    return this._http.get<SearchResults[]>('https://www.omdbapi.com/?s='+query+'&apikey=25b3e747');
  }
 
  //Get details of a specific (chosen from search) movie from API
  getMovie(movie: string){
    return this._http.get<MovieData[]>('https://www.omdbapi.com/?t='+movie+'&apikey=25b3e747');
  }

  //Insert a new favorite into the database provided the movie and the user who favorited it
  insertNewFavorite(userid: string, movieData: any){
    return this.db.doc(`Data/Favorites/${userid}/${movieData.Title}`).set({
      Title: movieData.Title,
      Poster: movieData.Poster,
      Year: movieData.Year
    })
  }

  //Remove a favorite from the user
  removeFavorite(userid: string, title: string){
    return this.db.doc(`Data/Favorites/${userid}/${title}`).delete().then(function() {
  }).catch(function(error) {
      console.error("Error removing document: ", error);
  });
  }

  //Check if a user favorited a given movie
  checkFavorite(userid: string, title: string){
     return this.db.doc(`Data/Favorites/${userid}/${title}`).get().toPromise().then(snapshot => {
      return snapshot.exists;
    });
  }

  //Check if a user reviewed a given movie
  checkReviewed(userid: string, title: string){
    return this.db.doc(`Data/Reviews/${userid}/${title}`).get().toPromise().then(snapshot => {
     return snapshot.exists;
   });
 }

 //Insert a new review into the database provided the movie, review details, and the user who favorited it
 insertNewReview(userid: string, movieData: any, headline, review, rating){
  return this.db.doc(`Data/Reviews/${userid}/${movieData.Title}`).set({
    Headline: headline,
    Review: review,
    Rating: rating
  })
}

//Get a user's favorites
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