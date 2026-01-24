import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Observable, Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { ProjectDataService } from "@core/services/project-data.service";
import { SpinnerFacadeService } from "@core/services/spinner-facade.service";
import { Contact } from "@shared/models/project-data.model";
import { BannerComponent } from "@shared/components/banner/banner.component";

@Component({
  selector: "app-contact-page",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, BannerComponent],
  templateUrl: "./contact-page.component.html",
  styleUrl: "./contact-page.component.scss",
})
export class ContactPageComponent implements OnInit, OnDestroy {
  contactData$?: Observable<Contact>;
  contactForm!: FormGroup;
  private langSubscription?: Subscription;

  constructor(
    private projectData: ProjectDataService,
    private spinner: SpinnerFacadeService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadData();

    // Reload data when language changes
    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      this.loadData();
    });
  }

  private loadData(): void {
    this.spinner.show();
    this.contactData$ = this.projectData.getContactData();
    this.contactData$.subscribe({
      next: (data) => {
        this.buildForm(data);
        this.spinner.hide();
      },
      error: () => this.spinner.hide(),
    });
  }

  ngOnDestroy(): void {
    this.langSubscription?.unsubscribe();
  }

  buildForm(data: Contact): void {
    const formControls: Record<string, any> = {};
    data.form.fields.forEach((field) => {
      const fieldName = this.getFieldName(field.placeholder);
      formControls[fieldName] = [field.required ? Validators.required : null];
    });
    this.contactForm = this.fb.group(formControls);
  }

  getFieldName(placeholder: string): string {
    return placeholder.toLowerCase().replace(/\s/g, "_");
  }

  getPhoneLink(phone: string): string {
    return "tel:" + phone.replace(/\s/g, "");
  }

  getMapLink(address: string): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
  }

  getSafeMapUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log("Form submitted:", this.contactForm.value);
      // Handle form submission
    }
  }
}
