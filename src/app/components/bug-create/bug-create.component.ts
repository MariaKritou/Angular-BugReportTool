import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { BugService } from 'src/app/services/bug.service';
import { Bug } from '../../model/bug-model';

@Component({
  selector: 'app-bug-create',
  templateUrl: './bug-create.component.html',
  styleUrls: ['./bug-create.component.css']
})
export class BugCreateComponent implements OnInit {
  bugFormGroup?: FormGroup;
  bug: Bug;
  bugsList: Bug[] = [];

  constructor(private bugService: BugService, private formBuilder: FormBuilder) {

    this.createForm();
  }

  //On initialize get all data
  ngOnInit(): void {
    this.bugService.readAll().subscribe((bugs) => {
      this.bugsList = bugs;
    });
  }

  //Create the form to add a new bug
  createForm() {

    this.bugFormGroup = this.formBuilder.group({

      id: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['', Validators.required],
      reporter: ['', Validators.required],
      status: ['']
    });

  }

  //On create button click we call the create function from the 
  //service and pass the value of the form
  onSubmit() {

    //Add validator to the status only if reporter is QA
    if (this.bugFormGroup.get('reporter').value == 'QA') {
      this.bugFormGroup.get('status').validator = <any>Validators.compose([Validators.required]);
    }

    this.bugService.create(this.bugFormGroup.value)
      .subscribe((result) => {
        this.ngOnInit(); //reload the table
      });
  }
}
