import {Component, OnInit} from '@angular/core';
import { DictionaryServiceService } from '../services/authentication/dictionary-service.service';

@Component({
  selector: 'app-rewriter',
  standalone: false,
  templateUrl: './rewriter.component.html',
  styleUrl: './rewriter.component.css'
})
export class RewriterComponent implements OnInit {
  originalText = "helo your beutifful";
  correctedText = "";
  status = "Ready";
  error = "";

  constructor(private dictionary: DictionaryServiceService) {}

  async ngOnInit() {
    await this.loadDictionary();
  }

  async loadDictionary() {
    this.status = "Loading dictionary...";
    try {
      await this.dictionary.loadDictionary();
      this.status = "Ready";
      this.error = "";
    } catch (err) {
      this.status = "Error";
      this.error = "Failed to load dictionary. Please check your internet connection and refresh.";
      console.error(err);
    }
  }

  async correctText() {
    if (this.status !== "Ready") return;

    this.status = "Correcting...";
    this.error = "";

    try {
      this.correctedText = await this.processText(this.originalText);
      this.status = "Ready";
    } catch (err) {
      this.status = "Error";
      this.error = "Error during text correction";
      console.error(err);
    }
  }

  private async processText(text: string): Promise<string> {
    return text.split(/(\s+)/).map(token => {
      if (/^\s+$/.test(token)) return token;

      const wordMatch = token.match(/^(\W*)(\w+)(\W*)$/);
      if (!wordMatch) return token;

      const [_, prefix, word, suffix] = wordMatch;

      if (!this.dictionary.checkWord(word.toLowerCase())) {
        const suggestions = this.dictionary.suggestWord(word.toLowerCase());
        if (suggestions.length > 0) {
          const corrected = suggestions[0];
          return prefix +
            (word[0] === word[0].toUpperCase() ?
              corrected.charAt(0).toUpperCase() + corrected.slice(1) :
              corrected) +
            suffix;
        }
      }
      return token;
    }).join('');
  }

  reset() {
    this.originalText = "";
    this.correctedText = "";
    this.error = "";
    this.status = "Ready";
  }
}
