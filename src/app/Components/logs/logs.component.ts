import { Component, OnInit } from '@angular/core';
import { LogService } from 'src/app/Services/log.service';


@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit{
  public logs: any = [];
  public selectedTimeframe: string = 'Last 5 mins';
  public customStartTime: string = '';
  public customEndTime: string = '';
  public showCustomTimePicker: boolean = false;
  public showIdColumn: boolean = true;
  public showIpAddressColumn: boolean = true;
  public showRequestBodyColumn: boolean = true;
  public showTimeStampColumn: boolean = true;

  
  constructor(private log: LogService  )  {}
  
  ngOnInit(): void {
    this.filterLogs();
}
    
  getLogs() {
  console.log('Custom Start Time:', this.customStartTime);
  console.log('Custom End Time:', this.customEndTime);
  if (this.customStartTime && this.customEndTime) {
    this.log.getLogs(this.customStartTime, this.customEndTime).subscribe((res) => {
      this.logs = res;
      console.log('Custom Start Time:', this.customStartTime);
      console.log('Custom End Time:', this.customEndTime);
      console.log('API Response:', res);
    });
}
}
    onTimeframeChange() {
      if (this.selectedTimeframe !== 'Custom') {
        this.showCustomTimePicker = false;
        this.filterLogs();
      }else{
        this.showCustomTimePicker = true;
      }
    }
    onCustomDateTimeChange() {
        this.filterLogs();
    }
      filterLogs(){
        if(this.selectedTimeframe !== 'Custom'){
        const now = new Date();
        let startTime: Date;
        switch (this.selectedTimeframe) {
          case 'Last 5 mins':
            startTime = new Date(now.getTime() - 5 * 60 * 1000);
            break;
          case 'Last 10 mins':
            startTime = new Date(now.getTime() - 10 * 60 * 1000);
            break;
          case 'Last 30 mins':
            startTime = new Date(now.getTime() - 30 * 60 * 1000);
            break;
          default:
            startTime = new Date();
        }
        
        
        const endTime = new Date();

        this.log.getLogs(startTime.toISOString(), endTime.toISOString()).subscribe((res)=>{
          this.logs = res;
        });

        }
        else if(this.showCustomTimePicker){
          this.getLogs();
        }
        else{
          this.logs = [];
        }
      }
      
    }



