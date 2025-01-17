import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie.model';
import { environment } from '../environments/environment';
import { IGenericApi } from '../shared/generic-api';
import { ApiResponse } from '../shared/models/api-response';
import { ApiService } from './api-service';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiUrl = environment.apiUrl; // Replace with your .NET Core API endpoint
  private apiKey = environment.apiKey;
  movieApi: IGenericApi;
  constructor(apiService: ApiService, private http: HttpClient) {
    this.movieApi = apiService.createAPI('movies');
  }

  searchMovies(title: string): Promise<ApiResponse<Movie[]>> {
    return this.movieApi.get(null, 'v1/', { s: title, apikey: this.apiKey });
  }
}
