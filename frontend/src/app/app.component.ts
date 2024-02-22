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
  allMovies: MovieTest[] = []
  constructor(private http: HttpClient) {

  }
  ngOnInit() {
    this.getMovies()
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

    // Gets All Movies In Database, stores them in allMovies variable
    this.http.get('http://localhost:8080/movies/get').subscribe((data: any) =>{

    for (let i = 0; i < data.length; i++) {
        let m = new MovieTest(data[i].Title, data[i].Year, data[i].Genre, data[i].Producer)
        this.allMovies.push(m)

      }
    }
    )
  }

  addAllMovies() {
    let dataUrl = "../assets/datasets/data.tsv"
    let movies: Movie[] = []

    let allData: string[] = []
    this.http.get(dataUrl, { responseType: 'text' }).subscribe(bookdata => {

      if (200) {
        allData = bookdata.split('\n')
      }

      for (let i = 0; i < 3; i++) {
        let m = this.parseMovie(allData[i])

        movies.push(m)
      }
      
      for (let g = 0; g < movies.length; g++) {
        let Movie =
        {
          "TitleType": movies[g].TitleType,
          "Title": movies[g].Title,
          "OriginalTitle": movies[g].OriginalTitle,
          "Year": movies[g].Year,
          "Runtime": movies[g].Runtime,
          "Genre": movies[g].Genre
        }

        
        let options = { headers: { 'Content-Type': 'application/json' } };

        this.http.post('http://localhost:8080/movie/add', JSON.stringify(Movie),options).subscribe((res: any)=> {
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

      // post stops here
    },
    (error) => {

      if (error === 404) {
        alert('Not Found')
      }

      else if (error === 401) {
        alert('Incorrectly Placed Info')
      }

      else if (error === 500) {
        alert('Server Down')
      }

      else if (error === 502) {
        alert('Bad Gateway')
      }
    })
  }

  parseMovie(mString: string): Movie {
    let mDetails = mString.split('\t')
    console.log(mDetails)


    let ttype = mDetails[1]
    let title = mDetails[2]
    let otitle = mDetails[3]
    let year = parseInt(mDetails[5])
    let rtime = parseInt(mDetails[7])

    let mGenres = mDetails[8].split(',')

    let genre = mGenres[0];

    let movie = new Movie(ttype, title, otitle, year, rtime, genre)
    return movie
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

class Movie {
  TitleType:  string
  Title:  string
  OriginalTitle:  string
  Year: number
  Runtime:  number
  Genre:  string

  constructor(ttype: string, title: string, otitle: string, year: number, runtime: number, genre: string) {
    this.TitleType = ttype
    this.Title = title
    this.OriginalTitle = otitle
    this.Year = year
    this.Runtime = runtime
    this.Genre = genre
  }

}