import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Site } from '@shared/models/project-data.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() siteData?: Site;

  @Output() languageChange = new EventEmitter<string>();

  onLanguageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.languageChange.emit(select.value);
  }
}

