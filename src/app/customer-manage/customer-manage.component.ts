import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustInformation } from '../StoreEntity/CustInformation';
import { CommonModule } from '@angular/common';
import { CustomerService } from './customer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Action } from 'rxjs/internal/scheduler/Action';

@Component({
  selector: 'app-customer-manage',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './customer-manage.component.html',
  styleUrls: ['./customer-manage.component.css']
})
export class CustomerManageComponent implements OnInit {
  CustomerForm!: FormGroup;
  error!: string;
  saveBtn: boolean = true;
  updateBtn: boolean = false;
  afterupdate: boolean = false;
  header? :string;
  pageAction? : string;

  constructor(private formBuilder: FormBuilder, private customerService: CustomerService, private router: Router, private route: ActivatedRoute) {
    this.CustomerForm = this.formBuilder.group({
      customerId: [0],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      contact: ['', Validators.required],
      phyAddress: ['', Validators.required],
      action: ['', Validators.required]
    });
  }

  ngOnInit() {    
    this.route.queryParams.subscribe(params => {
      const customer: CustInformation = {
        customerId: +params['id'] || 0,
        firstName: params['firstName'] || '',
        middleName: params['middleName'] || '',
        lastName: params['lastName'] || '',
        email: params['email'] || '',
        contact: params['contact'] || '',
        phyAddress: params['phyAddress'] || '',
        action : params['action']||''
      };
      this.updateForm(customer);
    });
  }

  CustomerAction() {
    const Customer: CustInformation = {
      customerId: this.CustomerForm.get('customerId')?.value,
      firstName: this.CustomerForm.get('firstName')?.value,
      middleName: this.CustomerForm.get('middleName')?.value,
      lastName: this.CustomerForm.get('lastName')?.value,
      email: this.CustomerForm.get('email')?.value,
      contact: this.CustomerForm.get('contact')?.value,
      phyAddress: this.CustomerForm.get('phyAddress')?.value,
      action : this.CustomerForm.get('action')?.value,
    };
    if (this.isValid(Customer)) {
      alert(this.error);
      return;
    }
    if(Customer.customerId==0)
      this.header = "register";
      Customer.action = "register";
    this.customerService.AddCustomer(Customer).subscribe((data) => {
      console.log(data);
    });
    this.RemoveInformation();
    this.router.navigate(['/data-reports']);
  }

  updateForm(userInfo: CustInformation) {
    if (!userInfo) {
      console.error('No userInfo received');
      return;
    }
    if(userInfo.customerId==0)    
      this.header = 'register';
    else
      this.header = userInfo.action;
    this.CustomerForm.setValue({
      customerId: userInfo.customerId || 0,
      firstName: userInfo.firstName || '',
      middleName: userInfo.middleName || '',
      lastName: userInfo.lastName || '',
      email: userInfo.email || '',
      contact: userInfo.contact || '',
      phyAddress: userInfo.phyAddress || '',
      action : userInfo.action
    });
  }

  RemoveInformation() {
    this.CustomerForm.reset({
      customerId: 0,
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      contact: '',
      phyAddress: ''
    });
  }

  isValid(customerValid: CustInformation): string {
    this.error = '';
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

    if (!customerValid.firstName || customerValid.firstName!.trim() === '') {
      this.error = 'Please enter first name';
    }
    else if (!customerValid.middleName || customerValid.middleName!.trim() === '') {
      this.error = 'Please enter middle name';
    }
    else if (!customerValid.lastName || customerValid.lastName!.trim() === '') {
      this.error = 'Please enter last name';
    }
    else if (!customerValid.email || !emailRegex.test(String(customerValid.email).toLowerCase())) {
      this.error = 'Please enter email in correct form';
    }
    else if (!customerValid.contact || customerValid.contact!.trim() === '') {
      this.error = 'Please enter contact';
    }
    else if (!customerValid.phyAddress || customerValid.phyAddress!.trim() === '') {
      this.error = 'Please enter physical address';
    }
    return this.error;
  }
}







// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
// import { CustInformation } from '../StoreEntity/CustInformation';
// import { CommonModule } from '@angular/common';
// import { CustomerService } from './customer.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-customer-manage',
//   standalone: true,
//   imports: [ReactiveFormsModule, CommonModule],
//   templateUrl: './customer-manage.component.html',
//   styleUrls: ['./customer-manage.component.css']
// })
// export class CustomerManageComponent implements OnInit {

//   CustomerForm!: FormGroup;
//   customerInfo!: CustInformation;
//   customerInfos: CustInformation[] = [];
//   error!: string;
//   saveBtn: boolean = true;
//   updateBtn: boolean = false;

//   constructor(private formBuilder: FormBuilder, private customerService: CustomerService, private router: Router) { }

//   ngOnInit() {
//     this.CustomerForm = this.formBuilder.group({
//       customerId: [0],
//       firstName: ['', Validators.required],
//       middleName: [''],
//       lastName: ['', Validators.required],
//       email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
//       contact: ['', Validators.required],
//       phyAddress: ['', Validators.required]
//     });
//   }
//   CustomerAction() {
//     const Customer: CustInformation = {
//       customerId: this.CustomerForm.get('customerId')?.value,
//       firstName: this.CustomerForm.get('firstName')?.value,
//       middleName: this.CustomerForm.get('middleName')?.value,
//       lastName: this.CustomerForm.get('lastName')?.value,
//       email: this.CustomerForm.get('email')?.value,
//       contact: this.CustomerForm.get('contact')?.value,
//       phyAddress: this.CustomerForm.get('phyAddress')?.value,
//     };
//     if (this.isValid(Customer)) {
//       alert(this.error);
//       return;
//     }
//     this.customerService.AddCustomer(Customer).subscribe((data) => {
//       console.log(data);
//     })
//     this.RemoveInformation();
//     this.router.navigate(['/data-reports']);
//   }

//   // GetInfo(userInfo: CustInformation) {
//   //   this.updateBtn = true;
//   //   this.saveBtn = false;
//   //   this.CustomerForm.setValue({
//   //     firstName: userInfo.firstName,
//   //     middleName: userInfo.middleName,
//   //     lastName: userInfo.lastName,
//   //     email: userInfo.email,
//   //     contact: userInfo.contact,
//   //     phyAddress: userInfo.phyAddress
//   //   });
//   //   this.router.navigate(['/customer-manage']);
//   // }

//   GetInfo(userInfo: any) {
//     console.log('User Info received:', userInfo);
//     this.CustomerForm.setValue({
//       customerId: userInfo.customerId || 0,
//       firstName: userInfo.firstName || '',
//       middleName: userInfo.middleName || '',
//       lastName: userInfo.lastName || '',
//       email: userInfo.email || '',
//       contact: userInfo.contact || '',
//       phyAddress: userInfo.phyAddress || ''
//     });
//     console.log('Form values after setValue:', this.CustomerForm.value);
//     this.router.navigate(['/customer-manage']);
//   }
  


//   RemoveInformation() {
//     this.CustomerForm.get('firstName')?.patchValue('');
//     this.CustomerForm.get('middleName')?.patchValue('');
//     this.CustomerForm.get('lastName')?.patchValue('');
//     this.CustomerForm.get('email')?.patchValue('');
//     this.CustomerForm.get('contact')?.patchValue('');
//     this.CustomerForm.get('phyAddress')?.patchValue('');
//   }
//   isValid(customerValid: CustInformation): string {
//     this.error = '';
//     const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

//     if (!customerValid.firstName || customerValid.firstName!.trim() == '') {
//       this.error = 'Please enter first name';
//     }
//     else if (!customerValid.middleName || customerValid.middleName!.trim() == '') {
//       this.error = 'Please enter middle name';
//     }
//     else if (!customerValid.lastName || customerValid.lastName!.trim() == '') {
//       this.error = 'Please enter last name';
//     }
//     else if (!customerValid.email || !emailRegex.test(String(customerValid.email).toLowerCase())) {
//       this.error = 'Please enter email in correct form';
//     }
//     else if (!customerValid.contact || customerValid.contact!.trim() == '') {
//       this.error = 'Please enter contact';
//     }
//     else if (!customerValid.phyAddress || customerValid.phyAddress!.trim() == '') {
//       this.error = 'Please enter physical address';
//     }
//     return this.error;
//   }
// }
