import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MoviesService } from '../movies.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent implements OnInit {
  user: firebase.User; 
  movie: string;
  movieData: any = {};
  ratingData: any = {};
  reviewData: any[] =[];
  liked: Boolean = false;
  reviewed: Boolean = false;
  ratings = [1,2,3,4,5,6,7,8,9,10];
  movieRating = 0;

  constructor(private auth: AuthService, private route: ActivatedRoute, private movies: MoviesService) { }

  ngOnInit() {
    //If the user is logged in
    this.auth.getUserState()
    .subscribe( async user => {
      this.user = user;
      //Check if they favorited the movie
      if (await this.movies.checkFavorite(this.user.uid, this.movie)==true){
        this.liked = true;
      }
      //Check if they reviewed the movie
      if (await this.movies.checkReviewed(this.user.uid, this.movie)==true){
        this.reviewed = true;
      }
    })

    //Check the currently selected movie and load
    this.route.paramMap.subscribe(async params => {
      this.movie = params.get('movie');
      this.loadMovie();
      this.reviewData = await this.movies.getReviewsMovie(this.movie);
      this.calculateAvgScore();
    });
  }

  //Get the average score
  calculateAvgScore(){
    if (this.reviewData.length > 0){
    var reviewScores = this.reviewData.map(x => x['Rating']);
    var total = 0.00;
    for (var i = 0; i<reviewScores.length; i++){
      total += reviewScores[i];
    }
    total = total / reviewScores.length;
    this.movieRating = total;
  }
  }

  //Load the movie data from the API
  loadMovie(){
    return this.movies.getMovie(this.movie)
      .subscribe(
        data => 
        {
          this.movieData = data;
          this.ratingData = data['Ratings'];
        },
        error => console.log("error")
      );
  }
  

  //Favorite a movie for the logged in user
  favorite(){
    this.liked = !this.liked;
    this.movies.insertNewFavorite(this.user.uid, this.movieData);
  }

  //Unfavorite a movie for the logged in user
  unFavorite(){
    this.liked = !this.liked;
    this.movies.removeFavorite(this.user.uid, this.movie);
  }

  //Submit a review for the logged in user, update the review data and score
  async submitReview(reviewForm){
    this.reviewed = true;
    this.movies.insertNewReviewUser(this.user.uid, this.movieData, reviewForm.value.headline, reviewForm.value.review, reviewForm.value.rating);
    this.movies.insertNewReviewMovie(this.user.displayName, this.user.uid, this.movieData, reviewForm.value.headline, reviewForm.value.review, reviewForm.value.rating);
    this.reviewData = await this.movies.getReviewsMovie(this.movie);
    this.calculateAvgScore();
  }
 
}
