import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { ActivatedRoute, Router } from '@angular/router';
import { FireService } from 'src/app/services/fire.service';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent {
  userForm: FormGroup;
  @Input() buttonText = "Create";
  guid: any
  @Output() loginEvent: EventEmitter<string> = new EventEmitter<string>();
  constructor(private fb: FormBuilder,
    private router: Router, private route: ActivatedRoute, private fire: FireService) {
    this.userForm = this.fb.group({
      userName: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.guid = params['uuid'];
    });
  }

  async createRoom() {
    const user = this.userForm.value.userName;
    console.log(this.buttonText)
    if (this.buttonText === 'Create') {
      let obj: {
        createdBy: string,
        createdOn: Date,
        usersData: { [key: string]: number },
        reveal: boolean
      } = {
        createdBy: user,
        createdOn: new Date(),
        usersData: {},
        reveal: false
      };
      obj.usersData[user] = 0;
      const uuid = uuidv4();

      if (this.userForm.valid) {
        sessionStorage.setItem('agilepoker-userName', user);
        const userName = sessionStorage.getItem('agilepoker-userName');
        console.log(userName)
        console.log(obj)
        await this.fire.createRoom(uuid, user);

        this.router.navigateByUrl(`room/${uuid}`);
        this.userForm.reset();
      }
    } else {

      sessionStorage.setItem('agilepoker-userName', user);
      const userName = sessionStorage.getItem('agilepoker-userName');
      console.log(userName);

      this.fire.addUserToRoom(this.guid, user, false,false);
      this.router.navigateByUrl(`room/${this.guid}`);
      this.loginEvent.emit()



    }
  }

}
