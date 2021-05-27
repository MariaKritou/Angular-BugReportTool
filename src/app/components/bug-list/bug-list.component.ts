import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { title } from 'process';
import { BugService } from 'src/app/services/bug.service';
import { Bug } from '../../model/bug-model';

@Component({
  selector: 'app-bug-list',
  templateUrl: './bug-list.component.html',
  styleUrls: ['./bug-list.component.css']
})

export class BugListComponent implements OnInit {
  bugsList: Bug[] = [];
  bugFromTable: Bug;
  bugFormGroupEdit?: FormGroup;
  bugFormGroupComment?: FormGroup;
  filter: any;

  //For pagination
  pageCounter: number = 0;
  prevbtn: string = "prevbtn";
  nextbtn: string = "nextbtn";

  //For sorting
  key: string = 'title';
  reverse: boolean = false;

  constructor(private bugService: BugService, private formBuilder: FormBuilder,
    private modalService: NgbModal, private el: ElementRef) {
    this.createForm();
  }

  ngOnInit(): void {

    this.bugService.readAll().subscribe((bugs) => {
      this.bugsList = bugs;
    });

    //Disable the previous btn for the first page
    if (this.pageCounter == 0) {
      this.disableBtn(this.prevbtn);
    }

  }

  createForm() {

    //Create the form for editing the bug
    this.bugFormGroupEdit = this.formBuilder.group({

      id: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['', Validators.required],
      reporter: ['', Validators.required],
      status: ['', Validators.required],
      updatedAt: ['', Validators.required],
      createdAt: ['', Validators.required]
    });

    //Create the form for commenting the bug
    this.bugFormGroupComment = this.formBuilder.group({
      id: ['', Validators.required],
      reporter: ['', Validators.required],
      description: ['', Validators.required],
    })

  }

  //Open the edit modal and pass the values to the form
  openEdit(targetModal, bugModal: Bug) {
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    });
    this.bugFormGroupEdit.patchValue({
      id: bugModal.id,
      title: bugModal.title,
      description: bugModal.description,
      priority: bugModal.priority,
      reporter: bugModal.reporter,
      status: bugModal.status,
      createdAt: bugModal.createdAt,
    });
  }

  //Open the comment modal
  openComment(targetModal, bugModal: Bug) {
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    });

  }

  /*  addComment(id: String) {
     this.bugService.update(id, this.bugFormGroupComment.value)
       .subscribe((results) => {
         this.ngOnInit();
         this.modalService.dismissAll();
       });
   } */

  editBug(bugEdit: Bug) {
    this.bugService.update(bugEdit.id, this.bugFormGroupEdit.value)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }

  deleteBug(bugDelete: Bug) {
    this.bugService.delete(bugDelete.id).subscribe((results) => {
      this.ngOnInit();
    });

  }

  //Take the text that was type to filter the table by the bug title
  search() {

    //If no text is added return the whole bug list
    if (this.filter == "") {
      this.ngOnInit();

    }
    //If text was typed then turn everything to lower and filter data
    else {
      this.bugsList = this.bugsList.filter(res => {
        return res.title.toLocaleLowerCase().match(this.filter.toLocaleLowerCase());
      });
    }
  }

  //Reverse the list to sort table from any column
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  //Next page is only enabled and can only increment if the list of bugs is equal to ten 
  //and makes a get request on the specific page that is represented by pageCounter
  nextPage() {

    this.enableBtn(this.prevbtn);

    if (this.bugsList.length == 10) {
      this.pageCounter++;
    }
    else {
      this.disableBtn(this.nextbtn);
    }

    this.bugService.paginate(this.pageCounter).subscribe((bugs) => {
      this.bugsList = bugs;
      if (this.bugsList.length !== 10) {
        this.disableBtn(this.nextbtn);
      }

    });
  }

  //Previous page is only enabled and can only decrement only if the pageCounter is more than zero 
  //and makes a get request on the specific page that is represented by pageCounter
  prevPage() {

    this.enableBtn(this.nextbtn);

    if (this.pageCounter > 0) {
      this.pageCounter--;
      if (this.pageCounter == 0) {
        this.disableBtn(this.prevbtn);
      }
    }

    this.bugService.paginate(this.pageCounter).subscribe((bugs) => {
      this.bugsList = bugs;

    });
  }

  //Disable and Enable the buttons for pagination
  disableBtn(btn: string) {
    let paginationBtn = this.el.nativeElement.querySelector('#' + btn);
    paginationBtn.disabled = true;
  }

  enableBtn(btn: string) {
    let paginationBtn = this.el.nativeElement.querySelector('#' + btn);
    paginationBtn.disabled = false;
  }

}
