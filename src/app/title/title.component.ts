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
  liked: Boolean = false;

  constructor(private auth: AuthService, private route: ActivatedRoute, private movies: MoviesService) { }

  ngOnInit() {
    this.auth.getUserState()
    .subscribe( async user => {
      this.user = user;
      if (await this.movies.checkFavorite(this.user.uid, this.movie)==true){
        this.liked = true;
      }
    })

    this.route.paramMap.subscribe(params => {
      this.movie = params.get('movie');
      this.loadMovie();
    });

    
  }
  
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

  favorite(){
    this.liked = !this.liked;
    this.movies.insertNewFavorite(this.user.uid, this.movieData);
  }

  unFavorite(){
    this.liked = !this.liked;
    this.movies.removeFavorite(this.user.uid, this.movie);
  }

}
