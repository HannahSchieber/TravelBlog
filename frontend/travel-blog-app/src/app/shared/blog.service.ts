import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Token} from './api.service';


export class Entry {
  id?: string;
  title: string;
  text: string;
  date?: Date;
  author?: string; // nickname
  author_id?: string;
  tags?: string[];
  image?: string;
}

/**
 * model of the application data
 */
export interface TravelBlogModel {
  /**
   * list of all displayed travels
   */
  listOfAllEntries: Entry[];
  /**
   * current user
   */
  currentUser: Token;
}


@Injectable({
  providedIn: 'root'
})
export class BlogService {

  entries: Observable<Entry[]>;
  user: Observable<Token>;
  private behaviorEntries: BehaviorSubject<Entry[]>;
  private behaviorUser: BehaviorSubject<Token>;
  dataStore: TravelBlogModel = {
    listOfAllEntries: [],
    currentUser: null
  };

  constructor() {
    this.dataStore = {
      listOfAllEntries: [],
      currentUser: null
    };
    this.behaviorEntries = new BehaviorSubject([]) as BehaviorSubject<Entry[]>;
    this.entries = this.behaviorEntries.asObservable();

    this.behaviorUser = new BehaviorSubject(null) as BehaviorSubject<Token>;
    this.user = this.behaviorUser.asObservable();
  }

  setUser(user: Token) {
    this.dataStore.currentUser = user;
    this.behaviorUser.next(Object.assign({}, this.dataStore).currentUser);
  }

  removeUser() {
    this.dataStore.currentUser = null;
    this.behaviorUser.next(Object.assign({}, this.dataStore).currentUser);
  }

  setAllEntries(entries: Entry[]) {
    this.dataStore.listOfAllEntries = entries;
    this.behaviorEntries.next(Object.assign({}, this.dataStore).listOfAllEntries);
  }

  addNewEntry(entry: Entry) {
    this.dataStore.listOfAllEntries.push(entry);
    this.behaviorEntries.next(Object.assign({}, this.dataStore).listOfAllEntries);
  }

  updateExistingEntry(entry: Entry) {
    this.dataStore.listOfAllEntries.forEach((elem, i) => {
      if (elem.id === entry.id) { this.dataStore.listOfAllEntries[i] = entry; }
    });

    this.behaviorEntries.next(Object.assign({}, this.dataStore).listOfAllEntries);
  }

  removeExistingEntry(entryId: string) {
    this.dataStore.listOfAllEntries.forEach((elem, i) => {
      if (elem.id === entryId) { this.dataStore.listOfAllEntries.splice(i, 1); }
    });

    this.behaviorEntries.next(Object.assign({}, this.dataStore).listOfAllEntries);
  }


}
