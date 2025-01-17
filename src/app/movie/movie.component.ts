import { Component, ViewChild } from '@angular/core';
import { Movie } from '../models/movie.model';
import { MovieService } from '../services/movie.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule, FormsModule,MatTableModule,MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CommonModule,
     MatPaginatorModule],
 
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.scss'
})
export class MovieComponent {
  searchTerm: string = '';
  movies: Movie[] = [];
  pageSize = 5;
  totalMovies = 50; 
  pageSizeOptions = [5, 10, 25, 100];
  displayedColumns: string[] = ['title', 'year', 'image'];  // Columns to display in the table
  dataSource = new MatTableDataSource<Movie>();  // Initialize MatTableDataSource
  currentPage = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private movieService: MovieService) {}
  ngAfterViewInit() {
    this.dataSource.sort = this.sort; // Attach MatSort to DataSource
  }

  ngOnInit(): void {
    this.init();
  }

  async init() {
    
    this.onSearch();
    // this.updatePageData();
  }

  onSearch(): void {
    this.movieService.searchMovies(this.searchTerm).then(
      (data) => {
        this.totalMovies = this.movies.length
        const startIndex = this.currentPage * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.movies = this.movies.slice(startIndex, endIndex);
        this.dataSource = new MatTableDataSource(this.movies);
      },
        
      (error) => console.error('Error fetching movies:', error)
    );
  }
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.onSearch();
  }

  // updatePageData(): void {
  //   const startIndex = this.currentPage * this.pageSize;
  //   const endIndex = startIndex + this.pageSize;
  //   this.movies = this.movies.slice(startIndex, endIndex);
  //   console.log('Data for current page:', this.dataSource);  // Log to check if data updates correctly
  // }
}
