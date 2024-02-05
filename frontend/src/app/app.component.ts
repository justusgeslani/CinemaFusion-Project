import { Component } from '@angular/core';
import { HttpClient, HttpHandler, HttpRequest } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Movie Site';

  constructor(private http: HttpClient) {

  }

  addMovie(f: NgForm) {

    let title = f.value.title
    let year = f.value.year
    let genre = f.value.genre
    let producer = f.value.producer

    console.log(title)

    let movieTest = {
      "Title": title,
      "Year": year,
      "Genre": genre,
      "Producer": producer
    };
  
    const options = { headers: { 'Content-Type': 'application/json' } };
    this.http.post('http://localhost:8080/movies/create', JSON.stringify(movieTest),options).subscribe((res: any)=> {
      if (200) {
        alert("Successful Movie Addition to database");
      }
      }, (error) => {
        if (error.status === 404) {
          alert('Resource not found.');
        }
        else if (error.status === 403) {
          alert('Forbidden Access to Resource');
        }
        else if (error.status === 409) {
          alert('Movie already exists. Please try another one.');
        }
        else if (error.status === 500) {
          alert('Server down.');
        }
        else if (error.status === 502) {
          alert('Bad gateway.');
        }
      }
    );
  }

  getMovies() {

    var allMovies = this.http.get('http://localhost:8080/movies/get')
    console.log(allMovies)
  }
}

class MovieTest {
  Title: string;
  Year: number;
  Genre: string;
  Producer: string;

  constructor(title: string, year: number, genre: string, producer: string) {
    this.Title = title
    this.Year = year
    this.Genre = genre
    this.Producer = producer
  }
}
