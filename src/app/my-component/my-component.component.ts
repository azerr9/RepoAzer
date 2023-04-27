import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface MyItem {
  id: number;
  name: string;
  description: string;
  price: number;
}

@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.css']
})
export class MyComponentComponent implements OnInit {

  apiUrl = 'http://localhost:3000/items';
  items: MyItem[] = [];
  currentItem: MyItem = {
    id: 0,
    name: '',
    description: '',
    price: 0
  };
  editMode = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getItems().subscribe(items => {
      this.items = items;
    });
  }

  getItems(): Observable<MyItem[]> {
    return this.http.get<MyItem[]>(this.apiUrl);
  }

  addItem(): void {
    this.http.post<MyItem>(this.apiUrl, this.currentItem).subscribe(item => {
      this.items.push(item);
      this.currentItem = {
        id: 0,
        name: '',
        description: '',
        price: 0
      };
    });
  }

  updateItem(): void {
    this.http.put<MyItem>(`${this.apiUrl}/${this.currentItem.id}`, this.currentItem).subscribe(() => {
      const index = this.items.findIndex(item => item.id === this.currentItem.id);
      if (index !== -1) {
        this.items[index] = this.currentItem;
        this.currentItem = {
          id: 0,
          name: '',
          description: '',
          price: 0
        };
      }
    });
  }

  deleteItem(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      const index = this.items.findIndex(item => item.id === id);
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    });
  }

  editItem(item: MyItem): void {
    this.currentItem = { ...item };
  }
  cancelEdit(): void {
    this.editMode = false;
    this.currentItem = {} as MyItem;
  }

}
