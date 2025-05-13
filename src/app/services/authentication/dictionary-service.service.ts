import { Injectable } from '@angular/core';
import Typo from 'typo-js';

@Injectable({
  providedIn: 'root'
})
export class DictionaryServiceService {
  private dictionary: Typo | null = null;
  private dictionaryLoaded = false;

  async loadDictionary(): Promise<void> {
    if (this.dictionaryLoaded) return;

    try {
      // Try loading from CDN first
      this.dictionary = await this.loadDictionaryFromCDN();
    } catch (cdnError) {
      console.warn('CDN load failed, trying local fallback', cdnError);
      try {
        // Fallback to local dictionary
        this.dictionary = await this.loadLocalDictionary();
      } catch (localError) {
        console.error('All dictionary load attempts failed', localError);
        throw new Error('Could not load dictionary');
      }
    }
    this.dictionaryLoaded = true;
  }

  private loadDictionaryFromCDN(): Promise<Typo> {
    return new Promise((resolve, reject) => {
      const dict = new Typo('en_US', null, null, {
        asyncLoad: true,
        loadedCallback: (err) => {
          err ? reject(err) : resolve(dict);
        }
      });
    });
  }

  private async loadLocalDictionary(): Promise<Typo> {
    // You'll need to add dictionary files to your assets
    // See note below about dictionary files
    const aff = await fetch('/assets/dictionaries/en_US.aff').then(r => r.text());
    const dic = await fetch('/assets/dictionaries/en_US.dic').then(r => r.text());

    return new Typo('en_US', aff, dic);
  }

  checkWord(word: string): boolean {
    if (!this.dictionary) throw new Error('Dictionary not loaded');
    return this.dictionary.check(word);
  }

  suggestWord(word: string): string[] {
    if (!this.dictionary) throw new Error('Dictionary not loaded');
    return this.dictionary.suggest(word) || [];
  }
}
