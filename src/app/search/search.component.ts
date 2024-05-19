import {Component, effect, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TmdbService} from "../service/tmdb.service";
import {Movie, MovieApiResponse} from "../service/model/movie.model";
import {debounce, filter, interval, map} from "rxjs";
import {MovieCardComponent} from "../home/movie-selector/movie-list/movie-card/movie-card.component";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MovieCardComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit{

  activatedRoute = inject(ActivatedRoute);
  tmdbService: TmdbService = inject(TmdbService);
  movies: Movie[] | undefined;


  constructor(){
    effect(():void => {
      let movieResponse: MovieApiResponse | undefined = this.tmdbService.search().value;
      if(movieResponse !== undefined){
        this.movies = movieResponse.results;
      }
    })
  }

  ngOnInit(): void {
    this.onSearchTerm();
  }

  private onSearchTerm(): void {
    this.activatedRoute.queryParams.pipe(
      filter(queryParam => queryParam['q']),
      debounce(() => interval(300)),
      map(queryParam => queryParam['q']),
    ).subscribe({
      next: term => this.tmdbService.searchByTerm(term)
    })
  }



}




