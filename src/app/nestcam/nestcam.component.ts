import { DeviceService } from '../providers/device-service/device-service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, DataTable, LazyLoadEvent, DialogModule, LightboxModule } from "primeng/primeng";
import { Observable } from "rxjs";
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'at-nestcam',
  templateUrl: './nestcam.component.html'
})
export class NestcamComponent implements OnInit {

  @ViewChild("dt") dt: DataTable;
  
  isStreaming: boolean;
  cameraName: string;
  selectedRows: Array<any>;  
 
  Events = [];
  

  constructor(private apollo: Apollo, private _deviceService: DeviceService) {

    // Subscribe to devices$ Observable.
    this._deviceService.devices$.subscribe(devices => {

      const nestcams = devices;

    });

  }

  ngOnInit() {

    const AllNestCams = gql`
    query allNestCams {
      allNestCams {
          id
          name
          isStreaming
        }
    }`;

    const queryObservable = this.apollo.watchQuery({

      query: AllNestCams,
      pollInterval: 500

    }).subscribe(({ data, loading }: any) => {

      this.isStreaming = data.allNestCams[0].isStreaming;

      if (this.isStreaming) {

        this.cameraName = data.allNestCams[0].name;

      } else {

        this.cameraName = 'Offline';

      }

    });

    const AllMotionEvents = gql`
    query allMotionEvents {
      allMotionEvents {
          id
          cameraid
          cameraName
          eventDate
          image
        }
    }`;

    const queryAllDataObservable = this.apollo.watchQuery({

      query: AllMotionEvents,
      pollInterval: 100

    }).subscribe(({ data, loading }: any) => {
      this.Events = data.allMotionEvents;    
    });

  }

}