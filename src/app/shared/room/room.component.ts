import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { interval, Subscription } from 'rxjs';
import { FireService } from 'src/app/services/fire.service';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { UsersChartComponent } from '../users-chart/users-chart.component';


@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent {
  @ViewChild(UsersChartComponent, { static: false }) usersChartComp: UsersChartComponent | undefined;
  currentUrl: string;
  roomId: any;
  invitationUrl: any;
  copyButton: string = ' Room Link ';
  usersData: any
  reveal: boolean = false;
  createdBy: string = '';
  hideShareButton = false;
  averagePoints: any;
  isOwner: boolean = false;

  chartOptions: any = {
    animationEnabled: true,
    theme: "light",
    data: [{
      type: "pie",
      title: {
        text: "Pie Chart"
      },
      indexLabel: "{name}",
      indexLabelPlacement: "inside",
      dataPoints: []
    }]
  }
  public users: any

  constructor(private router: Router, private route: ActivatedRoute, private location: Location, private snackBar: MatSnackBar,
    private fire: FireService) {
    this.currentUrl = this.location.prepareExternalUrl(this.router.url);

  }
  cardData = [{ "point": 1, "color": "MediumSeaGreen" }, { "point": 3, "color": "white" }, { "point": 5, "color": "Tomato" }, { "point": 8, "color": "gray" }, { "point": 13, "color": "Orange" }]
  buttonText = "Login";
  isNameEntered = false;
  userName: any
  subscription!: Subscription;
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.roomId = params['uuid'];
    });
    this.invitationUrl = window.location.href;


    this.userName = sessionStorage.getItem('agilepoker-userName');
    const source = interval(2000); //  seconds
    this.subscription = source.subscribe(() =>
      this.getData()

    );
    this.getData();

  }

  getData() {

    this.fire.getUsersInRoom(this.roomId).subscribe(users => {

      if (users.length) {
        this.users = users?.sort((a: any, b: any) => a?.userName?.localeCompare(b?.userName));
        const data = this.users.filter((x: any) => x.userName === this.userName);
        if (data.length) {
          this.isNameEntered = true;
          this.reveal = data[0].reveal;
          this.isOwner = data[0].isOwner;
          if (this.reveal) {
            this.calculateAverage();
            this.usersChartComp?.updateChartOptions();
          }
        }
        else {
          this.isNameEntered = false;
        }
      }
      else {
        this.router.navigateByUrl('')
      }
    });

  }

  onCopyclick() {
    this.hideShareButton = true;
    this.copyButton = ' Copied URL ✅';
    setTimeout(() => {
      this.copyButton = ' Room Link ';
      this.hideShareButton = false;

    }, 5000);

  }

  calculateDataPoints() {
    let dataPoints = [];
    let points = this.users.map((user: any) => user.selectedCard);

    let allPoints = [1, 3, 5, 8, 13]
    for (let index = 0; index < allPoints.length; index++) {
      const element = allPoints[index];
      let filterData = points.filter((point: any) => point === element);
      if (filterData.length > 0) {
        dataPoints.push({ name: element, repeatedTimes: filterData.length })
      }

    }
    this.chartOptions.data[0].dataPoints = [];
    for (let index = 0; index < dataPoints.length; index++) {
      const element = dataPoints[index];
      const repeatedTimes = element.repeatedTimes;
      const totalPoints = dataPoints.map((data) => data.repeatedTimes)
      const sum = totalPoints.reduce((accumulator: any, currentValue: any) => accumulator + currentValue, 0);

      const data: any = { name: element.name, y: (repeatedTimes / sum) * 100 };
      //finalDataPoints.push({ name: element.name, y: (repeatedTimes/sum) * 100 })
      this.chartOptions.data[0].dataPoints.push(data)
    }

  }


  onCardClick(point: number) {

    this.fire.setUserCardSelection(this.roomId, this.userName, point)

  }

  revealEstimates() {
    this.fire.setBatchReveal(this.roomId, true);
    this.calculateAverage();
    this.usersChartComp?.updateChartOptions();
  }

  calculateAverage() {
    const totalPoints = this.users?.reduce((acc: any, user: any) => acc + user?.selectedCard, 0);
    const validUsers = this.users.filter((user: any) => user.selectedCard > 0);
    let avg = totalPoints / validUsers.length;
    this.averagePoints = avg?.toFixed(2);
  }

  resetEstimates() {
    this.fire.resetSelectedCards(this.roomId);

  }

  showSnackBar(message: string, verticalPosition: MatSnackBarVerticalPosition = 'top', action: string = '', duration: number = 3000) {
    this.snackBar.open(message, action, {
      duration: duration,
      verticalPosition: verticalPosition,
      horizontalPosition: 'center'
    });
  }

  accountInfo() {
    let msg = ' 👋 ' + this.userName + '.   Thanks for using Agile Poker 💗💗'
    this.showSnackBar(msg)
  }

  shareUrl() {
    this.showSnackBar(('URL Copied ✅. Please share it. 👍'))
  }

  ngOnDestroy() {
    //this.subscription.unsubscribe();
  }

}