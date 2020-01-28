import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MoviesService } from '../movies.service';
import { SearchResults } from '../searchResults.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchQuery: string;
  searchResults: SearchResults[];
  constructor(private route: ActivatedRoute, private movies: MoviesService) { 
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.searchQuery = params.get('query');
      this.loadMovies();
    });
  }
  
  loadMovies(){
    return this.movies.search(this.searchQuery)
      .subscribe(data => this.searchResults = data['Search']);
  }

}
