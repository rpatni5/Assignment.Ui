import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () =>
      import('./movie/movie.component').then(
        (c) => c.MovieComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
