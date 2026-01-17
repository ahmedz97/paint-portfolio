import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Observable } from "rxjs";
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
export class ContactPageComponent implements OnInit {
  contactData$?: Observable<Contact>;
  contactForm!: FormGroup;

  constructor(
    private projectData: ProjectDataService,
    private spinner: SpinnerFacadeService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
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

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log("Form submitted:", this.contactForm.value);
      // Handle form submission
    }
  }
}
