import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MoviesService } from '../movies.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent implements OnInit {
  movie: string;
  movieData: any = {};
  ratingData: any = {};

  constructor(private route: ActivatedRoute, private movies: MoviesService) { }

  ngOnInit() {
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

}
