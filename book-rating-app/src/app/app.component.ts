import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

// Created an interface because typescript will scream an error at me when trying to push elements to a book's ratings array
interface Book {
  title: string;
  description: string;
  authors: string;
  ratings: number[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  // Book data
  books:Book[] = [
    {
      "title": "The Shadow of the Wind",
      "description": "A mesmerizing tale of love and literature set in post-war Barcelona.",
      "authors": "Carlos Ruiz Zafón",
      "ratings": []
    },
    {
      "title": "The Catcher in the Rye",
      "description": "A classic novel that follows Holden Caulfield as he navigates through the streets of New York City.",
      "authors": "J.D. Salinger",
      "ratings": []
    },
    {
      "title": "To Kill a Mockingbird",
      "description": "A powerful story about racial injustice and moral growth in the Deep South.",
      "authors": "Harper Lee",
      "ratings": []
    }
]
  // Initial state

  endReached = false // whether the end has been reached / all books have been rated

  currBookIndex = 0; // tracking the current book's index / this is the book that we are visualizing

  // Each input field is binded with ngModel to these properties
  currBookTitle = this.books[this.currBookIndex].title
  currBookAuthors = this.books[this.currBookIndex].authors
  currBookDescription = this.books[this.currBookIndex].description
  calculatedAverageRating = this.calculateRating(this.books[this.currBookIndex].ratings) // this is all ratings' average calculated, this is being displayed

  currUserSelectedRating = -1 // this is the actual rating the user has currently chosen / it affects the calculated rating too.


  // Called when the Save button is clicked
  submitData() {
    // Saves the new data
    this.books[this.currBookIndex].title = this.currBookTitle
    this.books[this.currBookIndex].authors = this.currBookAuthors
    this.books[this.currBookIndex].description = this.currBookDescription

    // Only push the newly selected rating to the array of rating IF AN ACTUAL RATING WAS SELECTED by the user, otherwise don't touch the array
    if(this.currUserSelectedRating != -1){
      this.books[this.currBookIndex].ratings.push(this.currUserSelectedRating)
    }

    // In case the user has looked through every single book
    if(this.currBookIndex == this.books.length-1){
      this.endReached = true
      return
    }

    // Otherwise continue onwards until reaching the end
    this.currBookIndex++
    
    // Reset the state, so the book at the next current index is properly visualized
    this.resetState()
  }

  // Sets the currently displayed average rating based on the selected rating by the user
  setCurrentRating(newRating:number){
    // If the same rating button was clicked, perform a deselect and calculate the actual average rating that was before
    if(this.currUserSelectedRating == newRating){
      this.currUserSelectedRating=-1;
      this.calculatedAverageRating = this.calculateRating(this.books[this.currBookIndex].ratings)
      return;
    }
    // If another rating was selected, updated the average displayed rating BUT DONT ACTUALLY change the ratings array itself, instead create a brand new temp array
    this.calculatedAverageRating = this.calculateRating([...(this.books[this.currBookIndex].ratings), newRating])
    this.currUserSelectedRating = newRating
  }

  // Calculates average rating
  calculateRating(allRatings: number[]): number {
    if (allRatings.length === 0) return 0
    return allRatings.reduce((acc, cur) => acc + cur, 0) / allRatings.length
  }

  // Resets the current book's state / called when the currBookIndex has been changed
  resetState(){
    this.currBookTitle = this.books[this.currBookIndex].title;
    this.currBookAuthors = this.books[this.currBookIndex].authors;
    this.currBookDescription = this.books[this.currBookIndex].description;
    this.calculatedAverageRating = this.calculateRating(this.books[this.currBookIndex].ratings)
    this.currUserSelectedRating = -1
  }
  // Make it possible for the user to rate each book again by beginning from the start of the array yet again
  rateEachBookAgain(){
    this.currBookIndex = 0
    this.resetState()
    this.endReached = false; // important to reset this to false
  }
  finish(){
    alert("Congrats for rating all books, you can leave now!")
  }
}
