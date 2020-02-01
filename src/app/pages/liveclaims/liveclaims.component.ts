import { Component, OnInit, TemplateRef, Input, Output, Inject, EventEmitter } from '@angular/core';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { NbDialogService, NbMenuService, NB_WINDOW } from '@nebular/theme';
import {FormBuilder, FormGroup} from '@angular/forms';

import { SmartTableData } from '../../@core/data/smart-table';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { WikipediaService } from './wiki.service';
import { filter, map, delay } from 'rxjs/operators';

export interface User {
  name: string;
}

// export class ButtonViewComponent implements ViewCell, OnInit {
//   renderValue: string;

//   @Input() value: string | number;
//   @Input() rowData: any;

//   @Output() save: EventEmitter<any> = new EventEmitter();

//   ngOnInit() {
//     this.renderValue = 'Delete';
//   }

//   onClick() {
//     alert('Hello!');
//   }
// }
@Component({
  selector: 'ngx-liveclaims',
  templateUrl: './liveclaims.component.html',
  styleUrls: ['./liveclaims.component.scss'],
})
// @ViewChild('smartTable') smartTable;
export class LiveclaimsComponent implements OnInit {
  data;
  // drop down
  options: FormGroup;
  allOfficeFlag;
  allStatusFlag;
  allProfileFlag;
  allClaimFlag;
  // modalitem
  selectedModalItem1 = '1';
  selectedModalItem2 = '1';
  selectedPrintItem = '1';
  modalDate = new Date();
  items = [
    { title: 'Print HCFA'},
    { title: 'Print HCA(text)'},
    { title: 'Print Superbill'},
  ];
  items1 = [
    { title: ''},
    { title: 'Paid In Full'},
    { title: 'Balance Due'},
    { title: 'Settled'},
    { title: 'Internal Review'},
    { title: 'Bill Insurance'},
    { title: 'Bill Secondary Insurance'},
    { title: 'Worker`s Comp Claim'},
  ];
  itemtitle = '';

  modalsettings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true,
    columns: {
      claimid: {
        title: 'Claim ID',
        width: '30%',
      },
      patient: {
        title: 'Patient',
        width: '30%',
      },
      sdate: {
        title: 'Date of Service',
        width: '40%',
      },
    },
  };
  // autocomplete
  autocompleteItem: any = '';
  inputChanged: any = '';
  wikiItems: any[] = [];
  wikiItems1: any[] = [];
  wikiItems2: any[] = [];
  config: any = {'class': 'autoinput', 'max': 2, 'placeholder': 'Patient'};
  config1: any = {'class': 'autoinputone', 'max': 2, 'placeholder': 'Payer Name'};
  config2: any = {'class': 'autoinputtwo', 'max': 2, 'placeholder': ''};

  fromDate = new Date();
  tempDate = new Date();
  toDate = new Date();
  tempmonth = this.toDate.getMonth();
  // filter
  itemLoading = false;
  selectedItem;
  selectedItem1 = '1';
  settings = {
    selectMode: 'multi',
    actions: {
      add: true,
      edit: false,
      delete: true,
      select: false,
      position: 'right',
    },
    add: {
      addButtonContent: '<span class="add"><i  class="ion-ios-plus-outline"></i></span>',
      createButtonContent: '<span id="createrow"><i class="ion-checkmark" ></i></span>',
      cancelButtonContent: '<i class="ion-close"></i>',
      confirmCreate: false,
    },
    edit: {
      editButtonContent: '<i class="ion-edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: false,
    },


    hideSubHeader: true,


    columns: {
      id: {
        title: 'Claim ID',
        type: 'number',
        width: '7%',
      },
      patient: {
        title: 'Patient',
        type: 'string',
        width: '7%',
      },
      sdate: {
        title: 'Date of Service',
        type: 'date',
        width: '7%',
      },
      office: {
        title: 'Office',
        type: 'string',
        width: '7%',
      },
      billed: {
        title: 'Billed',
        type: 'currency',
        width: '5%',
      },
      allowed: {
        title: 'Allowed',
        type: 'currency',
        width: '5%',
      },
      adjmt: {
        title: 'Adjmt',
        type: 'currency',
        width: '5%',
      },
      insonepaid: {
        title: 'Ins1 Paid',
        type: 'currency',
        width: '7%',
      },
      instwopaid: {
        title: 'Ins2 Paid',
        type: 'currency',
        width: '7%',
      },
      pt: {
        title: 'Pt Paid',
        type: 'currency',
        width: '7%',
      },
      ins: {
        title: 'Ins Bal',
        type: 'currency',
        width: '7%',
      },
      ptline: {
        title: 'Pt Line Item Bal',
        type: 'currency',
        width: '7%',
      },
      claim: {
        title: 'Claim Bal',
        type: 'currency',
        width: '7%',
      },
      exp: {
        title: 'Exp Reimbr',
        type: 'currency',
        width: '7%',
      },
    },
  };

  // check
  checked = false;
  exams = [
    {
      id: 'office1',
      status: true,
      title: 'Exam 1',
    },
    {
      id: 'office2',
      status: true,
      title: 'Exam 2',
    },
    {
      id: 'office3',
      status: true,
      title: 'Exam 3',
    },
    {
      id: 'office4',
      status: true,
      title: 'Exam 4',
    },
    {
      id: 'office5',
      status: true,
      title: 'Inactive Exam Rooms',
    },
  ];
  statuses = [
    {
      id: 'paid',
      status: true,
      title: 'Paid In Full',
    },
    {
      id: 'settled',
      status: true,
      title: 'Settled',
    },
    {
      id: 'balance',
      status: true,
      title: 'Balance Due',
    },
    {
      id: 'internal',
      status: true,
      title: 'Internal Due',
    },
    {
      id: 'scrubbing',
      status: true,
      title: 'Scrubbing Error',
    },
    {
      id: 'other',
      status: true,
      title: 'Other',
    },
  ];
  profiles = [
    {
      id: 'noprofile',
      status: true,
      title: 'No Profile or Archived',
    },
    {
      id: 'newpatient',
      status: true,
      title: 'New Patient Visit',
    },
    {
      id: 'follow',
      status: true,
      title: 'Followup Visit',
    },
  ];
  claims = [
    {
      id: 'era',
      status: true,
      title: 'ERA Received',
      type: 'successclaim',
    },
    {
      id: 'clearing',
      status: true,
      title: 'In Process at Clearinghouse',
      type: 'infoclaim',
    },
    {
      id: 'payer',
      status: true,
      title: 'In Process at Payer',
      type: 'infoclaim',
    },
    {
      id: 'acknowledged',
      status: true,
      title: 'Payer Acknowledged',
      type: 'infoclaim',
    },
    {
      id: 'coordination',
      status: true,
      title: 'Coordination of Benefits',
      type: 'infoclaim',
    },
    {
      id: 'other',
      status: true,
      title: 'Other',
      type: 'infoclaim',
    },
    {
      id: 'rejected',
      status: true,
      title: 'Rejected',
      type: 'dangerclaim',
    },
    {
      id: 'denied',
      status: true,
      title: 'ERA Denied',
      type: 'dangerclaim',
    },
    {
      id: 'notsubmit',
      status: true,
      title: 'Not Submitted',
      type: 'dangerclaim',
    },
    {
      id: 'missing',
      status: true,
      title: 'Missing Information',
      type: 'dangerclaim',
    },
  ];
  officeLabel = 'ALL';
  alloffice = true;
  statusLabel = 'ALL';
  allstatus = true;
  profileLabel = 'ALL';
  allprofile = true;
  claimLabel = 'ALL';
  allclaim = true;

  allcnt = '-';
  successcnt = '-';
  infocnt = '-';
  dangercnt = '-';

  toggle(checked: boolean) {
    this.checked = checked;
  }

  // aaaaaaaaaa
  // onUserRowSelect(event) {
  //   this.selectedRows = event.selected;
  //   this.selcetedRowscnt = this.selectedRows.length;
  // }
  source: LocalDataSource = new LocalDataSource();
  constructor(private service: SmartTableData, private dialogService: NbDialogService, private autoservice: WikipediaService, private nbMenuService: NbMenuService, @Inject(NB_WINDOW) private window, fb: FormBuilder) {
    this.tempmonth = this.toDate.getMonth();
    this.fromDate.setMonth(this.tempmonth -1);
    ////////dropdown/////
    this.options = fb.group({
      'fixed': false,
      'top': 0,
      'bottom': 0,
    });
    // const data = this.service.getData();
    this.data = [
      {
        id: 133022133,
        patient: 'Leanne Graham',
        sdate: '11/11/2019 04:45PM',
        office: 'Primary Office',
        billed: '$1,200.00',
        allowed: '$1,200.00',
        adjmt: '$0.00',
        insonepaid: '$0.00',
        instwopaid: '$0.00',
        pt: '$0.00',
        ins: '$0.00',
        ptline: '$1,200.00',
        claim: '$1,200.00',
        exp: '$0.00',
      },
      {
        id: 133022134,
        patient: 'Jane Graham',
        sdate: '11/11/2019 04:45PM',
        office: 'Primary Office',
        billed: '$1,000.00',
        allowed: '$1,000.00',
        adjmt: '$0.00',
        insonepaid: '$0.00',
        instwopaid: '$0.00',
        pt: '$0.00',
        ins: '$0.00',
        ptline: '$1,000.00',
        claim: '$1,000.00',
        exp: '$0.00',
      },
      {
        id: 133022135,
        patient: 'Jhon Graham',
        sdate: '11/11/2019 04:45PM',
        office: 'Primary Office',
        billed: '$100.00',
        allowed: '$100.00',
        adjmt: '$0.00',
        insonepaid: '$0.00',
        instwopaid: '$0.00',
        pt: '$0.00',
        ins: '$0.00',
        ptline: '$100.00',
        claim: '$100.00',
        exp: '$0.00',
      },
      {
        id: 133022136,
        patient: 'Smith Graham',
        sdate: '11/11/2019 04:45PM',
        office: 'Primary Office',
        billed: '$1,100.00',
        allowed: '$1,100.00',
        adjmt: '$0.00',
        insonepaid: '$0.00',
        instwopaid: '$0.00',
        pt: '$0.00',
        ins: '$0.00',
        ptline: '$1,100.00',
        claim: '$1,100.00',
        exp: '$0.00',
      },
      {
        id: 133022137,
        patient: 'Mihail Graham',
        sdate: '11/12/2019 04:45PM',
        office: 'Primary Office',
        billed: '$1,500.00',
        allowed: '$1,500.00',
        adjmt: '$0.00',
        insonepaid: '$0.00',
        instwopaid: '$0.00',
        pt: '$0.00',
        ins: '$0.00',
        ptline: '$1,500.00',
        claim: '$1,500.00',
        exp: '$0.00',
      },
    ];
    this.source.load(this.data);
  }
  open(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, { context: '' });
  }
  addRow(event) {
    // alert('asdf');
    // $('.add').click();
    // delay(1000);
    // $('.ion-checkmark').click();
    // alert('aaa');
    let temp = _.cloneDeep(this.data);
    // alert(temp);
    temp.push({
      id: '',
      patient:'',
      sdate: '',
      office: '',
      billed: '',
      allowed: '',
      adjmt: '',
      insonepaid: '',
      instwopaid: '',
      pt: '',
      ins: '',
      ptline: '',
      claim: '',
      exp: '',
    })
    this.data = [];
    this.data = temp;
    this.source.load(this.data);
  }
  // drop-down1
  dropdownList = [];
  dropdownSettings:IDropdownSettings = {};
  ngOnInit() {
    
    document.getElementById('myDropdown').addEventListener('click', function (event) {
      event.stopPropagation(); 
    });
    document.getElementById('myDropdownstatus').addEventListener('click', function (event) {
      event.stopPropagation(); 
    });
    document.getElementById('myDropdownclaim').addEventListener('click', function (event) {
      event.stopPropagation(); 
    });
    document.getElementById('myDropdownprofile').addEventListener('click', function (event) {
      event.stopPropagation(); 
    });
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'All Exam Rooms',
      unSelectAllText: 'All Exam Rooms',
      itemsShowLimit: 2,
      allowSearchFilter: false
    };
    this.nbMenuService.onItemClick()
    .pipe(
      filter(({ tag }) => tag === 'my-context-menu'),
      map(({ item: { title } }) => title),
    )
    .subscribe(title => this.showDialog(title));
  }
  displayFn(user?: User): string | undefined {
    return user ? user.name : undefined;
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  ///////autocomplete/////
  
  onInputChangedEvent(val: string) {
    this.inputChanged = val;
  }
  onSelect(item: any) {
    this.selectedItem = item;
  }

  search (term: string) {
    this.autoservice.search(term).subscribe(e => this.wikiItems = e, error => console.log(error));
  }

  search1 (term: string) {
    this.autoservice.search(term).subscribe(e => this.wikiItems1 = e, error => console.log(error));
  }

  search2 (term: string) {
    this.autoservice.search(term).subscribe(e => this.wikiItems2 = e, error => console.log(error));
  }
  //////Modal event//////
  showDialog (item) {
    this.itemtitle = item;
    if (item == 'Print HCFA') {
      document.getElementById('showdetail').click();
    } else if (item == 'Print HCFA(text)') {
      document.getElementById('showdetail').click();
    } else if (item == 'Print Superbill') {
      document.getElementById('showdetail').click();
    } else {
      document.getElementById('showconfirm').click();
    }
  }
  showDetail(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, { context: this.itemtitle });
  }

  allSelect() {
    this.checkAllOffice(true);
  }
  allDeselect() {
    this.checkAllOffice(false);
  }
  allCheck() {
    this.checkAllOffice(true);
    this.checkAllProfile(true);
    this.checkAllClaim(true);
    this.checkAllStatus(true);
  }
  allUncheck() {
    this.checkAllOffice(false);
    this.checkAllProfile(false);
    this.checkAllClaim(false);
    this.checkAllStatus(false);
  }

  checkAllOffice(checked: boolean) {
    this.alloffice = checked;
    for(let i in this.exams) {
      this.exams[i].status = checked;
    }
    this.showLabel();
  }
  checkOffice(checked: boolean, id: string) {
    this.allOfficeFlag = 0;
    for(let i in this.exams) {
      if(this.exams[i].id == id) {
        this.exams[i].status = checked;
      }
      if(this.exams[i].status == false) {
        this.allOfficeFlag++;
      }
    }
    if(this.allOfficeFlag > 0) {
      this.alloffice = false;
    } else {
      this.alloffice = true;
    }
    this.showLabel();
  }
  showLabel() {
    if (this.alloffice == true) {
      this.officeLabel = 'ALL';
    } else {
      this.officeLabel = '';
      for(let i in this.exams) {
        if(this.exams[i].status == true) {
          this.officeLabel = this.officeLabel + this.exams[i].title + ',';
        }
      }
      if (this.officeLabel == '') {
        this.officeLabel = 'None';
      } else {
        if (this.officeLabel.length > 10) {
          this.officeLabel = this.officeLabel.substr(0, 10)+'...';
        }
      }
    }
  }
  checkAllStatus(checked: boolean) {
    this.allstatus = checked;
    for(let i in this.statuses) {
      this.statuses[i].status = checked;
    }
    this.showStatusLabel();
  }
  checkStatus(checked: boolean, id: string) {
    this.allStatusFlag = 0;
    for(let i in this.statuses) {
      if(this.statuses[i].id == id) {
        this.statuses[i].status = checked;
      }
      if(this.statuses[i].status == false) {
        this.allStatusFlag++;
      }
    }
    if(this.allStatusFlag > 0) {
      this.allstatus = false;
    } else {
      this.allstatus = true;
    }
    this.showStatusLabel();
  }
  showStatusLabel() {
    if (this.allstatus == true) {
      this.statusLabel = 'ALL';
    } else {
      this.statusLabel = '';
      for(let i in this.statuses) {
        if(this.statuses[i].status == true) {
          this.statusLabel = this.statusLabel + this.statuses[i].title + ',';
        }
      }
      if (this.statusLabel == '') {
        this.statusLabel = 'None';
      } else {
        if (this.statusLabel.length > 10) {
          this.statusLabel = this.statusLabel.substr(0, 10)+'...';
        }
      }
    }
  }
  checkAllClaim(checked: boolean) {
    this.allclaim = checked;
    for(let i in this.claims) {
      this.claims[i].status = checked;
    }
    this.showClaimLabel();
  }
  checkClaim(checked: boolean, id: string) {
    this.allClaimFlag = 0;
    for(let i in this.claims) {
      if(this.claims[i].id == id) {
        this.claims[i].status = checked;
      }
      if(this.claims[i].status == false) {
        this.allClaimFlag++;
      }
    }
    if(this.allClaimFlag > 0) {
      this.allclaim = false;
    } else {
      this.allclaim = true;
    }
    this.showClaimLabel();
  }
  showClaimLabel() {
    if (this.allclaim == true) {
      this.claimLabel = 'ALL';
    } else {
      this.claimLabel = '';
      for(let i in this.claims) {
        if(this.claims[i].status == true) {
          this.claimLabel = this.claimLabel + this.claims[i].title + ',';
        }
      }
      if (this.claimLabel == '') {
        this.claimLabel = 'None';
      } else {
        if (this.claimLabel.length > 10) {
          this.claimLabel = this.claimLabel.substr(0, 10)+'...';
        }
      }
    }
  }
  checkAllProfile(checked: boolean) {
    this.allprofile = checked;
    for(let i in this.profiles) {
      this.profiles[i].status = checked;
    }
    this.showProfileLabel();
  }
  checkProfile(checked: boolean, id: string) {
    this.allProfileFlag = 0;
    for(let i in this.profiles) {
      if(this.profiles[i].id == id) {
        this.profiles[i].status = checked;
      }
      if(this.profiles[i].status == false) {
        this.allProfileFlag++;
      }
    }
    if(this.allProfileFlag > 0) {
      this.allprofile = false;
    } else {
      this.allprofile = true;
    }
    this.showProfileLabel();
  }
  showProfileLabel() {
    if (this.allprofile == true) {
      this.profileLabel = 'ALL';
    } else {
      this.profileLabel = '';
      for(let i in this.profiles) {
        if(this.profiles[i].status == true) {
          this.profileLabel = this.profileLabel + this.profiles[i].title + ',';
        }
      }
      if (this.profileLabel == '') {
        this.profileLabel = 'None';
      } else {
        if (this.profileLabel.length > 10) {
          this.profileLabel = this.profileLabel.substr(0, 10)+'...';
        }
      }
    }
  }
  countClaim() {
    this.allcnt = '100';
    this.successcnt = '98';
    this.infocnt = '2';
    this.dangercnt = '0';
  }
}
