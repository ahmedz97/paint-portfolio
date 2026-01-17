import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Footer } from '@shared/models/project-data.model';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  @Input() footerData?: Footer;

  getExploreColumns(): Array<Array<{ text: string; link: string }>> {
    if (!this.footerData?.explore.links) return [];
    const midPoint = Math.ceil(this.footerData.explore.links.length / 2);
    return [
      this.footerData.explore.links.slice(0, midPoint),
      this.footerData.explore.links.slice(midPoint)
    ];
  }
}

