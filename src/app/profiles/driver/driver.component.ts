import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface DriverProfile {
  id: string;
  photoUrl: string;
  fullName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string; // ISO date string, e.g. '2027-08-15'
  vehicleMake: string;
  vehicleModel: string;
  vehicleColor: string;
  plateNumber: string;
  address: string;
  bio: string;
  verified: boolean;
}

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css']
})
export class DriverComponent implements OnInit {
// Falls back to mock data so the component renders on its own.
  // In real use, pass the actual driver in from the parent, e.g.
  // <app-driver-profile [driver]="currentDriver" (profileSaved)="onSaved($event)">
  @Input() driver: DriverProfile = DriverComponent.mockDriver();
  @Output() profileSaved = new EventEmitter<DriverProfile>();

  @ViewChild('photoInput') photoInput: ElementRef<HTMLInputElement>;

  form: FormGroup;
  isEditing = false;
  photoPreview: string;

  // Holds the picked file for when upload wiring is added later.
  // Not sent anywhere yet - this build only does a local preview.
  private pendingPhotoFile: File = null;

  private static mockDriver(): DriverProfile {
    return {
      id: 'drv_1042',
      photoUrl: 'https://i.pravatar.cc/200?img=12',
      fullName: 'Marco Villanueva',
      email: 'marco.villanueva@example.com',
      phone: '+63 917 555 1234',
      licenseNumber: 'N01-12-345678',
      licenseExpiry: '2027-08-15',
      vehicleMake: 'Toyota',
      vehicleModel: 'Vios',
      vehicleColor: 'Pearl White',
      plateNumber: 'NDJ 4821',
      address: 'Angeles City, Pampanga',
      bio: 'Driving with the app for 3 years. Friendly, on time, AC always on.',
      verified: true
    };
  }

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.photoPreview = this.driver.photoUrl;
    this.buildForm();
  }

  get f() {
    return this.form.controls;
  }

  startEditing(): void {
    this.isEditing = true;
    this.form.enable();
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.form.reset(this.driverToFormValue(this.driver));
    this.form.disable();
    this.photoPreview = this.driver.photoUrl;
    this.pendingPhotoFile = null;
  }

  saveProfile(): void {
    if (this.form.invalid) {
      this.form.markAsUntouched();
      this.snackBar.open('Please fix the highlighted fields before saving.', 'Dismiss', { duration: 3000 });
      return;
    }

    this.driver = {
      ...this.driver,
      ...this.form.value,
      photoUrl: this.photoPreview
    };

    // This is where the real save call would go once you wire it up, e.g.
    //   Express:  this.http.put(`/api/drivers/${this.driver.id}`, formData)
    //   Firebase: this.firestore.doc(`drivers/${this.driver.id}`).update(this.driver)
    // pendingPhotoFile would be uploaded alongside it.

    this.isEditing = false;
    this.form.disable();
    this.pendingPhotoFile = null;
    this.profileSaved.emit(this.driver);
    this.snackBar.open('Profile updated.', 'Dismiss', { duration: 2500 });
  }

  triggerPhotoSelect(): void {
    if (this.isEditing) {
      this.photoInput.nativeElement.click();
    }
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length ? input.files[0] : null;
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.snackBar.open('Please choose an image file.', 'Dismiss', { duration: 3000 });
      input.value = '';
      return;
    }

    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      this.snackBar.open('Image must be smaller than 5MB.', 'Dismiss', { duration: 3000 });
      input.value = '';
      return;
    }

    this.pendingPhotoFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview = reader.result as string;
    };
    reader.readAsDataURL(file);

    input.value = '';
  }

  private buildForm(): void {
    const value = this.driverToFormValue(this.driver);
    this.form = this.fb.group({
      fullName: [value.fullName, [Validators.required, Validators.minLength(3)]],
      email: [value.email, [Validators.required, Validators.email]],
      phone: [value.phone, [Validators.required, Validators.pattern(/^\+?[0-9\s-]{7,15}$/)]],
      licenseNumber: [value.licenseNumber, [Validators.required, Validators.minLength(5)]],
      licenseExpiry: [value.licenseExpiry, [Validators.required, this.futureDateValidator]],
      vehicleMake: [value.vehicleMake, Validators.required],
      vehicleModel: [value.vehicleModel, Validators.required],
      vehicleColor: [value.vehicleColor, Validators.required],
      plateNumber: [value.plateNumber, [Validators.required, Validators.pattern(/^[A-Za-z0-9\s-]{4,10}$/)]],
      address: [value.address, Validators.required],
      bio: [value.bio, Validators.maxLength(300)]
    });
    this.form.disable();
  }

  private driverToFormValue(driver: DriverProfile) {
    return {
      fullName: driver.fullName,
      email: driver.email,
      phone: driver.phone,
      licenseNumber: driver.licenseNumber,
      licenseExpiry: driver.licenseExpiry,
      vehicleMake: driver.vehicleMake,
      vehicleModel: driver.vehicleModel,
      vehicleColor: driver.vehicleColor,
      plateNumber: driver.plateNumber,
      address: driver.address,
      bio: driver.bio
    };
  }

  private futureDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!control.value) {
      return null;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(control.value);
    return expiry < today ? { expired: true } : null;
  }
}
